const path = require('path');
const fs = require('fs');
const level = require('level');

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

class DbFactory {
  constructor() {
    this.dbs = {};
  }
  /**
   * Synchronous.
   * @param {string} pid Project ID. **MUST** be globally unique. This method is cached to return singletons via cached instances.
   * @returns {level} Db instance.
   */
  getDb(pid) {
    let db = this.dbs[pid];
    if (!db) {
      db = this.dbs[pid] = level(asProjectPath(pid), DB_OPTIONS);
    }
    return db;
  }
}

const dbFactory = new DbFactory();

module.exports = { dbFactory, DbFactory, systemDb };
