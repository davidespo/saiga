const path = require('path');
const fs = require('fs');
const level = require('level');
const { Collection } = require('./Collection.js');
const { Project, SystemProject } = require('./Project.js');

const DATA_PATH = process.env.DATA_PATH || './.data';
const DB_OPTIONS = { valueEncoding: 'json' };

function createDirIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const systemPath = path.join(DATA_PATH, 'system');
const projectsPath = path.join(DATA_PATH, 'projects');
const asProjectPath = (project) => path.join(projectsPath, project);

createDirIfNotExists(systemPath);
createDirIfNotExists(projectsPath);

const systemDb = level(systemPath, DB_OPTIONS);
const system = new SystemProject(systemDb);

const DB_CACHE = {};

/**
 *
 * @param {string} projectId A globally unique project name. This method is cached to return singletons.
 */
function getDb(projectId) {
  let db = DB_CACHE[projectId];
  if (!db) {
    db = DB_CACHE[projectId] = level(asProjectPath(projectId), DB_OPTIONS);
  }
  return db;
}

const PROJECT_CACHE = {};

async function getProject(projectId) {
  let project = PROJECT_CACHE[projectId];
  if (!project) {
    project = PROJECT_CACHE[projectId] = new Project(getDb(projectId));
    const projects = system.getProjectCollection();
    const model = await projects.get(projectId);
    if (!model) {
      await projects.put(projectId, {
        projectId,
        created: new Date().toISOString(),
      });
    }
  }
  return project;
}

module.exports = {
  getDb,
  getProject,
  system,
  Collection,
  Project,
};
