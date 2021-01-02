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
    const projects = await system.getProjectCollection();
    let model = await projects.get(projectId);
    if (!model) {
      await projects.put(projectId, {
        projectId,
        created: new Date().toISOString(),
      });
      model = await projects.get(projectId);
    }
    project = PROJECT_CACHE[projectId] = new Project(getDb(projectId), model);
  }
  return project;
}

async function deleteProject(projectId) {
  delete PROJECT_CACHE[projectId];
  // TODO: proper delete/shutdown
  const projects = await system.getProjectCollection();
  await projects.remove(projectId);
}

module.exports = {
  deleteProject, // TODO: convert to CRUD and move under `system`
  getDb,
  getProject,
  system,
  Collection,
  Project,
};
