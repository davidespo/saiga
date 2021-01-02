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
  async getCollection(namespace) {
    let collection = this.collections[namespace];
    if (!collection) {
      collection = this.collections[namespace] = new Collection(
        this.db,
        namespace,
      );
      await this._collectionsDb.put(namespace, { namespace });
    }
    return collection;
  }
  async deleteCollection(namespace) {
    delete this.collections[namespace];
    await this._collectionsDb.remove(namespace);
  }
}

class SystemProject extends Project {
  async getProjectCollection() {
    return await this.getCollection('projects');
  }
  async getUsersCollection() {
    return await this.getCollection('users');
  }
}

module.exports = { Project, SystemProject };
