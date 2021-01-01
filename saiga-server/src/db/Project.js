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

module.exports = { Project };
