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
      collections: await Promise.all(
        Object.values(this.collections).map((collection) =>
          collection.getInfo(),
        ),
      ),
    };
  }
  async getCollection(namespace) {
    return this.collections[namespace];
  }
  async createCollection(namespace) {
    this.collections[namespace] = new Collection(this.db, namespace);
    await this._collectionsDb.put(namespace, { namespace });
    return this.collections[namespace];
  }
  async getOrCreateCollection(namespace) {
    let collection = this.collections[namespace];
    if (!collection) {
      collection = await this.createCollection(namespace);
    }
    return collection;
  }
  async deleteCollection(namespace) {
    if (!!this.collections[namespace]) {
      await this.collections[namespace].truncate();
      delete this.collections[namespace];
      await this._collectionsDb.remove(namespace);
    }
  }
}

class SystemProject extends Project {
  async getProjectCollection() {
    return await this.getOrCreateCollection('projects');
  }
  async getUsersCollection() {
    return await this.getOrCreateCollection('users');
  }
}

module.exports = { Project, SystemProject };
