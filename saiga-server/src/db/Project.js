const { Collection } = require('./Collection');

class Project {
  constructor(db, info) {
    this.db = db;
    this._collectionsDb = new Collection(db, '_collections');
    this.info = info;
    this.collections = {};
  }
  async getInfo() {
    return {
      ...this.info,
      collections: await this._collectionsDb
        .search({})
        .then((res) => res.content),
    };
  }
  getCollection(namespace) {
    let collection = this.collections[namespace];
    if (!collection) {
      collection = this.collections[namespace] = new Collection(
        this.db,
        namespace,
      );
      this._collectionsDb.put(namespace, { namespace });
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
