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

describe('API - System Routes', () => {
  describe('Projects', () => {
    it('should list projects', async () => {
      const res = await get('/api/system/projects');
      res.should.have.status(200);
      const { content, query, next } = res.body;
      expect(content).to.be.a('array');
      expect(query).to.deep.eq({ limit: 25, reverse: false });
      expect(next).null;
    });
    it('should search projects', async () => {
      const input = { filter: {}, limit: 3, reverse: true };
      const res = await post('/api/system/projects/_search', input);
      res.should.have.status(200);
      const { content, query, next } = res.body;
      expect(content).to.be.a('array');
      expect(query).to.deep.eq(input);
      expect(next).null;
    });
    it('should create new projects', async () => {
      const pid = `p_${nanoid(7)}`;
      const res = await post(`/api/system/projects/${pid}`, null);
      res.should.have.status(200);
      expect(res.body).to.deep.eq({
        _id: pid,
        _kind: 'projects',
        collections: [],
      });
    });
    it('should upsert existing projects', async () => {
      const pid = `p_${nanoid(7)}`;
      const project = await system.createProject(pid);
      const expected = await project.getInfo();
      const res = await post(`/api/system/projects/${pid}`, null);
      res.should.have.status(200);
      expect(res.body).to.deep.eq(expected);
    });
    it('should provide info of existing projects', async () => {
      const pid = `p_${nanoid(7)}`;
      const project = await system.createProject(pid);
      const expected = await project.getInfo();
      const res = await get(`/api/system/projects/${pid}`);
      res.should.have.status(200);
      expect(res.body).to.deep.eq(expected);
    });
    it('should handle details of non-existing projects', async () => {
      const pid = `p_${nanoid(7)}`;
      const res = await get(`/api/system/projects/${pid}`);
      res.should.have.status(404);
      expect(res.body).deep.eq({ message: 'Not Found', success: false });
    });
    it('should delete existing projects', async () => {
      const pid = `p_${nanoid(7)}`;
      await system.createProject(pid);
      const res = await del(`/api/system/projects/${pid}`);
      res.should.have.status(200);
      expect(res.body).deep.eq({ success: true });
      const project = await system.getProject(pid);
      expect(project).not.exist;
    });
    it('should handle delete of non-existing projects', async () => {
      const pid = `p_${nanoid(7)}`;
      const res = await del(`/api/system/projects/${pid}`);
      res.should.have.status(404);
      expect(res.body).deep.eq({ message: 'Not Found', success: false });
      const project = await system.getProject(pid);
      expect(project).not.exist;
    });
  });
  describe('Collection', () => {
    it('should create collection on existing project', async () => {
      const pid = `p_${nanoid(7)}`;
      const cid = `c_${nanoid(7)}`;
      await system.createProject(pid);
      const res = await post(`/api/system/projects/${pid}/${cid}`);
      res.should.have.status(200);
      expect(res.body).to.deep.eq({ success: true });
      const info = await system.getProject(pid).then((p) => p.getInfo());
      expect(info).to.deep.eq({
        _id: pid,
        _kind: 'projects',
        collections: [{ namespace: cid }],
      });
    });
    it('should create project/collection on non-existing project', async () => {
      const pid = `p_${nanoid(7)}`;
      const cid = `c_${nanoid(7)}`;
      const res = await post(`/api/system/projects/${pid}/${cid}`);
      res.should.have.status(200);
      expect(res.body).to.deep.eq({ success: true });
      const info = await system.getProject(pid).then((p) => p.getInfo());
      expect(info).to.deep.eq({
        _id: pid,
        _kind: 'projects',
        collections: [{ namespace: cid }],
      });
    });
    it('should delete existing collection on existing project', async () => {
      const pid = `p_${nanoid(7)}`;
      const cid = `c_${nanoid(7)}`;
      const project = await system.createProject(pid);
      await project.createCollection(cid);
      let info = await project.getInfo();
      expect(info).to.deep.eq({
        _id: pid,
        _kind: 'projects',
        collections: [{ namespace: cid }],
      });
      const res = await del(`/api/system/projects/${pid}/${cid}`);
      res.should.have.status(200);
      expect(res.body).to.deep.eq({ success: true });
      info = await project.getInfo();
      expect(info).to.deep.eq({
        _id: pid,
        _kind: 'projects',
        collections: [],
      });
    });
    it('should handle delete non-existing collection on existing project', async () => {
      const pid = `p_${nanoid(7)}`;
      const cid = `c_${nanoid(7)}`;
      const project = await system.createProject(pid);
      const res = await del(`/api/system/projects/${pid}/${cid}`);
      res.should.have.status(200);
      expect(res.body).to.deep.eq({ success: true });
      info = await project.getInfo();
      expect(info).to.deep.eq({
        _id: pid,
        _kind: 'projects',
        collections: [],
      });
    });
    it('should handle delete collection on non-existing project', async () => {
      const pid = `p_${nanoid(7)}`;
      const cid = `c_${nanoid(7)}`;
      const res = await del(`/api/system/projects/${pid}/${cid}`);
      res.should.have.status(404);
      expect(res.body).to.deep.eq({ message: 'Not Found', success: false });
    });
  });
});
