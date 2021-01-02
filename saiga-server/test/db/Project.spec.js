const { expect } = require('chai');
const { nanoid } = require('nanoid');
const _ = require('lodash');
const { system, deleteProject, getProject } = require('../../src/db/index.js');

const sleep = (delay) => new Promise((res) => setTimeout(res, delay));

describe('DB - Project', () => {
  describe('System Projects', () => {
    it('should not have null projects', async () => {
      const projects = await system.getProjectCollection();
      expect(projects).not.null;
    });
    it('should save new project', async () => {
      const projects = await system.getProjectCollection();
      const _id = `project${nanoid(6)}`;
      await getProject(_id);
      const actual = await projects.get(_id);
      expect(actual).not.null;
      expect(actual.projectId).eq(_id);
    });
  });
  describe('App Projects', () => {
    it('should namespace collections', async () => {
      const project = await getProject(`p${nanoid(7)}`);
      const colA = await project.getCollection('colA');
      const colB = await project.getCollection('colB');
      const _id = nanoid();
      await colA.put(_id, { testing: true });
      let actual = await colA.get(_id);
      expect(actual).not.null;
      actual = await colB.get(_id);
      expect(actual).null;
    });
    it('should CRUD app projects', async () => {
      const pid = `p_${nanoid(7)}`;
      const project = await getProject(pid);
      expect(project).not.null;
      const actual = await getProject(pid);
      expect(actual === project, 'project was not cached').true;
      const projectCollection = await system.getProjectCollection();
      let row = await projectCollection.get(pid);
      expect(row).not.null;
      await deleteProject(pid);
      row = await projectCollection.get(pid);
      expect(row).null;
    });
    it('should CRUD manage collections', async () => {
      const pid = `p_${nanoid(7)}`;
      const project = await getProject(pid);
      expect(project).not.null;
      const cid = `c_${nanoid(7)}`;
      await project.getCollection(cid);
      let info = await project.getInfo();
      delete info.created;
      expect(info).to.deep.eq({
        _id: pid,
        _kind: 'projects',
        collections: [
          {
            _id: cid,
            namespace: cid,
            _kind: '_collections',
          },
        ],
        projectId: pid,
      });
      await project.deleteCollection(cid);
      info = await project.getInfo();
      delete info.created;
      expect(info).to.deep.eq({
        _id: pid,
        _kind: 'projects',
        collections: [],
        projectId: pid,
      });
    });
    // TODO: proper cleanup
  });
});
