const { expect } = require('chai');
const { nanoid } = require('nanoid');
const _ = require('lodash');
const { getProject } = require('../../src/db/index.js');

describe('DB - Collection', () => {
  /*
   *    BASIC TESTS
   */
  it('should not error on missing key', async () => {
    const project = await getProject('testProject');
    const col = await project.getCollection('testCollection');
    const value = await col.get(nanoid());
    expect(value).null;
  });
  it('should CRUD', async () => {
    const project = await getProject('testProject');
    const col = await project.getCollection('testCollection');
    const id = nanoid(6);
    const model = { testing: true, num: 42 };
    const expected = { ...model, _id: id, _kind: 'testCollection' };
    let value = await col.get(id);
    expect(value, 'null before write').null;
    await col.put(id, model);
    value = await col.get(id);
    expect(value, 'read after write').deep.eq(expected);
    expected.num = 44;
    await col.put(id, expected);
    value = await col.get(id);
    expect(value, 'read after update').deep.eq(expected);
    await col.remove(id);
    value = await col.get(id);
    expect(value, 'null after delete').null;
  });

  /*
   *    SEARCH
   */
  const m = (key, value) => ({ key, value });
  const a = m('a', { num: 42 });
  const b = m('b', { num: 3.1415 });
  const c = m('c', { num: 44 });
  const d = m('d', { num: 0 });
  const models = [b, c, a, d];
  async function testSearch(filter, expectedRawArr, otherOptions = {}) {
    const project = await getProject('testProject');
    const _kind = `col${nanoid(7)}`;
    const searchCol = await project.getCollection(_kind);
    models.forEach(async ({ key, value }) => await searchCol.put(key, value));
    const options = { filter, ...otherOptions };
    const expected = {
      content: expectedRawArr.map(({ key: _id, value }) => ({
        ...value,
        _id,
        _kind,
      })),
      query: { filter, limit: 25, reverse: false, ...otherOptions },
      next: null,
    };
    const results = await searchCol.search(options);
    expect(results).to.deep.eq(expected);
  }

  it('should search with no filter', async () => {
    const filter = {};
    const expected = [a, b, c, d];
    await testSearch(filter, expected);
  });
  it('should search with range filter', async () => {
    const filter = { num: { $gt: 3, $lt: 43 } };
    const expected = [a, b];
    await testSearch(filter, expected);
  });
  it('should search with $in filter', async () => {
    const filter = { _id: { $in: ['c', 'a'] } };
    const expected = [a, c];
    await testSearch(filter, expected);
  });
  it('should search with limit and filter', async () => {
    const filter = { _id: { $gte: 'b' } };
    const options = { limit: 2 };
    const expected = [b, c];
    await testSearch(filter, expected, options);
  });
  it('should search reverse order with limit and filter', async () => {
    const filter = { _id: { $lte: 'c' } };
    const options = { limit: 2, reverse: true };
    const expected = [c, b];
    await testSearch(filter, expected, options);
  });

  /*
   *    COUNT
   */
  async function testCount(filter, expectedCount) {
    const project = await getProject('testProject');
    const _kind = `col_${nanoid(5)}`;
    const col = await project.getCollection(_kind);
    models.forEach(async ({ key, value }) => await col.put(key, value));
    const options = { filter };
    const expected = {
      count: expectedCount,
      query: { filter },
    };
    const results = await col.count(options);
    expect(results).to.deep.eq(expected);
  }
  it('should count with no filter', async () => {
    const filter = {};
    const expected = 4;
    await testCount(filter, expected);
  });
  it('should count with range filter', async () => {
    const filter = { num: { $gt: 3, $lt: 43 } };
    const expected = 2;
    await testCount(filter, expected);
  });
  it('should count with $in filter', async () => {
    const filter = { _id: { $in: ['c', 'a'] } };
    const expected = 2;
    await testCount(filter, expected);
  });

  /*
   *    TRUNCATE
   */
  it('should truncate all data', async () => {
    const project = await getProject('testProject');
    const col = await project.getCollection(`c_${nanoid()}`);
    let result = await col.count({});
    expect(result.count, 'expected to be empty before writes').eq(0);
    for (let i = 0; i < 10; i++) {
      await col.put(nanoid(), { testing: true });
    }
    result = await col.count({});
    expect(result.count, 'expected to have entries after writes').eq(10);
    await col.truncate();
    result = await col.count({});
    expect(result.count, 'expected to be empty after truncate').eq(0);
  });
});
