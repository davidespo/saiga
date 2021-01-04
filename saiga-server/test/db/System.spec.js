const { nanoid } = require('nanoid');
const { expect } = require('chai');
const { system, Project } = require('../../src/db');

const validate = async (pid, project) => {
  expect(project).to.exist;
  const info = await project.getInfo();
  expect(info).deep.eq({ _id: pid, _kind: 'projects', collections: [] });
};

describe('DB - System', () => {
  describe('Create Projects', () => {
    /*
     *    CREATE
     */
    it('should return null for non-existent project id', async () => {
      const project = await system.getProject(`p_${nanoid(7)}`);
      expect(project).not.exist;
    });
    it('should create project for new project id', async () => {
      const pid = `p_${nanoid(7)}`;
      const project = await system.createProject(pid);
      await validate(pid, project);
    });
    it('should not error creating project twice', async () => {
      const pid = `p_${nanoid(7)}`;
      const project = await system.createProject(pid);
      await validate(pid, project);
      const copy = await system.createProject(pid);
      await validate(pid, copy);
    });
    it('should getOrCreate project for new project id', async () => {
      const pid = `p_${nanoid(7)}`;
      const project = await system.getOrCreateProject(pid);
      await validate(pid, project);
    });
    it('should get project for existing project id', async () => {
      const pid = `p_${nanoid(7)}`;
      const p1 = await system.createProject(pid);
      await validate(pid, p1);
      const p2 = await system.getProject(pid);
      await validate(pid, p2);
      expect(p1 === p2, 'expected object to be the same').true;
    });
    it('should getOrCreate project for existing project id', async () => {
      const pid = `p_${nanoid(7)}`;
      const p1 = await system.createProject(pid);
      await validate(pid, p1);
      const p2 = await system.getOrCreateProject(pid);
      await validate(pid, p2);
      expect(p1 === p2, 'expected object to be the same').true;
    });
  });
  describe('Delete', () => {
    it("should not error deleting project that doesn't exist", async () => {
      const pid = `p_${nanoid(7)}`;
      await system.deleteProject(pid);
    });
    it('should delete existing project', async () => {
      const pid = `p_${nanoid(7)}`;
      const project = await system.createProject(pid);
      await validate(pid, project);
      await system.deleteProject(pid);
      const deleted = await system.getProject(pid);
      expect(deleted).not.exist;
    });
  });
});
