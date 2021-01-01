const { Collection } = require('./Collection');

class Project {
  constructor(db) {
    this.db = db;
    this.collections = {};
  }
  getCollection(namespace) {
    let collection = this.collections[namespace];
    if (!collection) {
      collection = this.collections[namespace] = new Collection(
        this.db,
        namespace,
      );
    }
    return collection;
  }
}

class SystemProject extends Project {
  getProjectCollection() {
    return this.getCollection('projects');
  }
  getUsersCollection() {
    return this.getCollection('users');
  }
}

module.exports = { Project, SystemProject };
