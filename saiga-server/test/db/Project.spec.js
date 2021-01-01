const { expect } = require('chai');
const { nanoid } = require('nanoid');
const _ = require('lodash');
const { system, getProject } = require('../../src/db/index.js');

const sleep = (delay) => new Promise((res) => setTimeout(res, delay));

describe('DB - Project', () => {
  describe('System Projects', () => {
    const projects = system.getProjects();
    it('should not have null projects', () => {
      expect(projects).not.null;
    });
    it('should save new project', async () => {
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
      const colA = project.getCollection('colA');
      const colB = project.getCollection('colB');
      const _id = nanoid();
      await colA.put(_id, { testing: true });
      let actual = await colA.get(_id);
      expect(actual).not.null;
      actual = await colB.get(_id);
      expect(actual).null;
    });
  });
});
