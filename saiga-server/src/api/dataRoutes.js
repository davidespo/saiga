const express = require('express');
const router = express.Router();
const { system } = require('../db');

const sendNotFound = (res) =>
  res.status(404).send({ success: false, message: 'Not Found' });

const getCollection = async (req) => {
  const { projectId, collectionId } = req.params;
  const project = await system.getOrCreateProject(projectId);
  return await project.getOrCreateCollection(collectionId);
};

/*
 *     LIST
 */
router.get('/:projectId/:collectionId', async (req, res) => {
  const collection = await getCollection(req);
  const payload = await collection.search({});
  res.send(payload);
});

/*
 *     SEARCH
 */
router.post('/:projectId/:collectionId/_search', async (req, res) => {
  const { filter, limit, reverse } = req.body;
  const collection = await getCollection(req);
  const payload = await collection.search({ filter, limit, reverse });
  res.send(payload);
});

/*
 *     DETAILS
 */
router.get('/:projectId/:collectionId/:_id', async (req, res) => {
  const { _id } = req.params;
  const collection = await getCollection(req);
  const payload = await collection.get(_id);
  if (!!payload) {
    res.send(payload);
  } else {
    sendNotFound(res);
  }
});

/*
 *     UPSERT
 */
router.post('/:projectId/:collectionId/:_id', async (req, res) => {
  const { _id } = req.params;
  const value = req.body;
  const collection = await getCollection(req);
  await collection.put(_id, value);
  const payload = await collection.get(_id);
  res.send(payload);
});

/*
 *     DELETE
 */
router.delete('/:projectId/:collectionId/:_id', async (req, res) => {
  const { _id } = req.params;
  const collection = await getCollection(req);
  const value = await collection.get(_id);
  if (!!value) {
    await collection.remove(_id);
    res.send({ success: true });
  } else {
    sendNotFound(res);
  }
});

module.exports = {
  router,
};
