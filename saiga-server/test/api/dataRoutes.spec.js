const chai = require('chai');
const chaiHttp = require('chai-http');
const _ = require('lodash');
const { nanoid } = require('nanoid');
const { app } = require('../../src/api');
const { system } = require('../../src/db');

const { expect } = chai;

// Configure chai
chai.use(chaiHttp);
chai.should();

// Utilities
const getIds = () => ({
  pid: `p_${nanoid(7)}`,
  cid: `c_${nanoid(7)}`,
  _id: `d_${nanoid(7)}`,
});
function call(url, method = 'get') {
  return new Promise((resolve, reject) =>
    chai
      .request(app)
      [method](url)
      .end((err, res) => {
        if (!!err) {
          reject(err);
        } else {
          resolve(res);
        }
      }),
  );
}
function callWithData(url, data, method = 'post') {
  return new Promise((resolve, reject) =>
    chai
      .request(app)
      [method](url)
      .send(data)
      .end((err, res) => {
        if (!!err) {
          reject(err);
        } else {
          resolve(res);
        }
      }),
  );
}
const get = (url) => call(url, 'get');
const del = (url) => call(url, 'delete');
const post = (url, data) => callWithData(url, data, 'post');
const put = (url, data) => callWithData(url, data, 'put');

describe('API - Data Routes', () => {
  describe('Project + Collection getOrCreate', () => {
    it("should create project/collection when they don't exist", async () => {
      const { pid, cid } = getIds();
      const res = await get(`/api/data/${pid}/${cid}`);
      res.should.have.status(200);
      expect(res.body).deep.eq({
        content: [],
        query: { limit: 25, reverse: false },
        next: null,
      });
      const project = await system.getProject(pid);
      expect(project).exist;
      expect(await project.getCollection(cid)).exist;
    });
    it("should create collection when it doesn't exist", async () => {
      const { pid, cid } = getIds();
      await system.createProject(pid);
      const project = await system.getProject(pid);
      expect(project).exist;
      const res = await get(`/api/data/${pid}/${cid}`);
      res.should.have.status(200);
      expect(res.body).deep.eq({
        content: [],
        query: { limit: 25, reverse: false },
        next: null,
      });
      expect(await project.getCollection(cid)).exist;
    });
  });
  describe('Data Management', () => {
    it('should list data for collection', async () => {
      const { pid, cid } = getIds();
      const project = await system.getOrCreateProject(pid);
      const col = await project.getOrCreateCollection(cid);
      col.put('a', { val: 123 });
      col.put('b', { val: 456 });
      const res = await get(`/api/data/${pid}/${cid}`);
      res.should.have.status(200);
      expect(res.body).deep.eq({
        content: [
          { _id: 'a', _kind: cid, val: 123 },
          { _id: 'b', _kind: cid, val: 456 },
        ],
        query: { limit: 25, reverse: false },
        next: null,
      });
    });
    it('should search data for collection', async () => {
      const { pid, cid } = getIds();
      const project = await system.getOrCreateProject(pid);
      const col = await project.getOrCreateCollection(cid);
      col.put('a', { val: 123 });
      col.put('b', { val: 456 });
      const res = await post(`/api/data/${pid}/${cid}/_search`, {
        filter: { _id: 'b' },
      });
      res.should.have.status(200);
      expect(res.body).deep.eq({
        content: [{ _id: 'b', _kind: cid, val: 456 }],
        query: { limit: 25, reverse: false, filter: { _id: 'b' } },
        next: null,
      });
    });
    it('should create data in collection for non-existing key', async () => {
      const { pid, cid, _id } = getIds();
      const value = { testing: true };
      const expected = { ...value, _id, _kind: cid };
      const project = await system.getOrCreateProject(pid);
      const col = await project.getOrCreateCollection(cid);
      expect(await col.get(_id)).not.exist;
      const res = await post(`/api/data/${pid}/${cid}/${_id}`, value);
      res.should.have.status(200);
      expect(res.body).deep.eq(expected);
      expect(await col.get(_id)).deep.eq(expected);
    });
    it('should update data in collection for existing key', async () => {
      const { pid, cid, _id } = getIds();
      const value = { num: 42 };
      const expected = { num: 42, _id, _kind: cid };
      const project = await system.getOrCreateProject(pid);
      const col = await project.getOrCreateCollection(cid);
      await col.put(_id, value);
      expect(await col.get(_id)).deep.eq(expected);
      value.num = expected.num = 44;
      const res = await post(`/api/data/${pid}/${cid}/${_id}`, value);
      res.should.have.status(200);
      expect(res.body).deep.eq(expected);
      expect(await col.get(_id)).deep.eq(expected);
    });
    it('should delete existing key', async () => {
      const { pid, cid, _id } = getIds();
      const project = await system.getOrCreateProject(pid);
      const col = await project.getOrCreateCollection(cid);
      await col.put(_id, { testing: true });
      expect(await col.get(_id)).exist;
      const res = await del(`/api/data/${pid}/${cid}/${_id}`);
      res.should.have.status(200);
      expect(res.body).deep.eq({ success: true });
      expect(await col.get(_id)).not.exist;
    });
    it('should handle delete for non-existing key', async () => {
      const { pid, cid, _id } = getIds();
      const project = await system.getOrCreateProject(pid);
      const col = await project.getOrCreateCollection(cid);
      expect(await col.get(_id)).not.exist;
      const res = await del(`/api/data/${pid}/${cid}/${_id}`);
      res.should.have.status(404);
      expect(res.body).deep.eq({ success: false, message: 'Not Found' });
      expect(await col.get(_id)).not.exist;
    });
  });
});
