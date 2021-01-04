const { Collection } = require('./Collection');
const { systemDb } = require('./DbFactory');

class Project {
  /**
   *
   * @param {level} db
   * @param {object} info
   * @param {string} info._id Project ID
   */
  constructor(db, info) {
    this.db = db;
    this._collectionsDb = new Collection(db, '_collections');
    this.info = { _kind: 'projects', ...info };
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
  /**
   *
   * @param {string} namespace
   * @returns {Promise<Collection>} `null` if doesn't exist
   */
  async getCollection(namespace) {
    return this.collections[namespace];
  }
  /**
   *
   * @param {string} namespace
   * @returns {Promise<Collection>}
   */
  async createCollection(namespace) {
    this.collections[namespace] = new Collection(this.db, namespace);
    await this._collectionsDb.put(namespace, { namespace });
    return this.collections[namespace];
  }
  /**
   *
   * @param {string} namespace
   * @returns {Promise<Collection>}
   */
  async getOrCreateCollection(namespace) {
    let collection = this.collections[namespace];
    if (!collection) {
      collection = await this.createCollection(namespace);
    }
    return collection;
  }
  /**
   *
   * @param {string} namespace
   */
  async deleteCollection(namespace) {
    if (!!this.collections[namespace]) {
      await this.collections[namespace].truncate();
      delete this.collections[namespace];
      await this._collectionsDb.remove(namespace);
    }
  }
}

const systemProject = new Project(systemDb, {});

module.exports = { Project, systemProject };
