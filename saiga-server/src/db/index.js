const path = require('path');
const fs = require('fs');
const level = require('level');

const DATA_PATH = process.env.DATA_PATH || './.data';

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

const DB_CACHE = {};

/**
 *
 * @param {string} projectId A globally unique project name. This method is cached to return singletons.
 */
function getDb(projectId) {
  let db = DB_CACHE[projectId];
  if (!db) {
    db = DB_CACHE[projectId] = level(asProjectPath(projectId), {
      valueEncoding: 'json',
    });
  }
  return db;
}

module.exports = {
  getDb,
};
