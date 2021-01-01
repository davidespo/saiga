const _ = require('lodash');
const sift = require('sift');

const toNsKeyGen = (namespace) => (key) => `${namespace}::${key}`;
const fromNsKeyGen = (namespace) => {
  // TODO: security, or something... maybe.
  const p = new RegExp(`^${namespace}::(.*)$`);
  return (key) => (p.test(key) ? p.exec(key)[1] : '');
};

class Collection {
  constructor(db, namespace) {
    this.db = db;
    this.namespace = namespace;
    this.toNsKey = toNsKeyGen(namespace);
    this.fromNsKey = fromNsKeyGen(namespace);
  }
  async get(key) {
    try {
      return await this.db.get(this.toNsKey(key));
    } catch (error) {
      // TODO: handle errors other than key not found
    }
    return null;
  }
  async put(key, value) {
    value._id = key;
    value._kind = this.namespace;
    await this.db.put(this.toNsKey(key), value);
  }
  /**
   *
   * @param {object} options
   * @param {object} options.filter Mongo compatible query
   * @param {number} options.limit The maximum number of results to return
   * @param {boolean} options.reverse Reverse the results. Only supports sorting based on primary key.
   */
  async search(options) {
    let { filter, limit = 25, reverse = false } = options; // TODO: support in memory sorting
    limit = Math.min(100, limit);
    const filterPredicate = _.isPlainObject(filter) ? sift(filter) : () => true;
    let content = [];

    return new Promise((res, rej) => {
      const streamOptions = {
        gte: `${this.namespace}:`,
        lt: `${this.namespace};`,
        reverse,
      };
      this.db
        .createReadStream(streamOptions)
        .on('data', ({ value }) => {
          if (content.length < limit && filterPredicate(value)) {
            content.push(value);
          }
        })
        .on('error', (err) => rej(err))
        .on('close', function () {
          const next = null; // TODO: pagination hints / next
          res({ content, query: { filter, limit, reverse }, next });
        });
      // .on('end', function () {
      //   console.log('Stream ended');
      // });
    });
  }
  async remove(key) {
    await this.db.del(key);
  }
}

module.exports = {
  Collection,
};
