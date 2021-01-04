const { expect } = require('chai');
const { nanoid } = require('nanoid');
const _ = require('lodash');
const { Project, dbFactory } = require('../../src/db/index.js');

const getProject = (pid) =>
  new Project(dbFactory.getDb(pid), { _id: pid, _kind: 'projects' });

describe('DB - Project', () => {
  it('should create collection', async () => {
    const project = getProject(`p${nanoid(7)}`);
    const colA = await project.createCollection('colA');
    expect(colA).not.null;
  });
  it("should create collection when it doesn't exist", async () => {
    const project = getProject(`p${nanoid(7)}`);
    const colA = await project.getOrCreateCollection('colA');
    expect(colA).not.null;
  });
  it('should namespace collections', async () => {
    const project = getProject(`p${nanoid(7)}`);
    const colA = await project.getOrCreateCollection('colA');
    const colB = await project.getOrCreateCollection('colB');
    const _id = nanoid();
    await colA.put(_id, { testing: true });
    let actual = await colA.get(_id);
    expect(actual).not.null;
    actual = await colB.get(_id);
    expect(actual).null;
  });
  it('should CRUD manage collections', async () => {
    // set up project
    const pid = `p_${nanoid(7)}`;
    const project = getProject(pid);
    expect(project).not.null;
    // validate project pre-state
    let info = await project.getInfo();
    delete info.created;
    expect(info).to.deep.eq({
      _id: pid,
      _kind: 'projects',
      collections: [],
    });
    // ensure that collection does not exist
    const cid = `c_${nanoid(7)}`;
    let col = await project.getCollection(cid);
    expect(col).undefined;
    // create collection
    col = await project.createCollection(cid);
    expect(col).not.undefined;
    // validate project post state
    info = await project.getInfo();
    delete info.created;
    expect(info).to.deep.eq({
      _id: pid,
      _kind: 'projects',
      collections: [{ namespace: cid }],
    });
    await project.deleteCollection(cid);
    info = await project.getInfo();
    delete info.created;
    expect(info).to.deep.eq({
      _id: pid,
      _kind: 'projects',
      collections: [],
    });
  });
  // TODO: proper cleanup
});
