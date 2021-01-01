const express = require('express');
const router = express.Router();
const { getProject } = require('../db');

const getCollection = async (req) => {
  const { projectId, collectionId } = req.params;
  const project = await getProject(projectId);
  return project.getCollection(collectionId);
};

router.get('/:projectId/:collectionId', async (req, res) => {
  const collection = await getCollection(req);
  const payload = await collection.search({});
  res.send(payload);
});

router.search('/:projectId/:collectionId', async (req, res) => {
  const { filter, limit, reverse } = req.body;
  const collection = await getCollection(req);
  const payload = await collection.search({ filter, limit, reverse });
  res.send(payload);
});

router.get('/:projectId/:collectionId/:_id', async (req, res) => {
  const { _id } = req.params;
  const collection = await getCollection(req);
  const payload = await collection.get(_id);
  if (!!payload) {
    res.send(payload);
  } else {
    res.status(404).send({ message: 'not found' });
  }
});

router.post('/:projectId/:collectionId/:_id', async (req, res) => {
  const { _id } = req.params;
  const value = req.body;
  const collection = await getCollection(req);
  await collection.put(_id, value);
  const payload = await collection.get(_id);
  res.send(payload);
});

router.delete('/:projectId/:collectionId/:_id', async (req, res) => {
  const { _id } = req.params;
  const value = req.body;
  const collection = await getCollection(req);
  await collection.remove(_id);
  res.send({ success: true });
});

module.exports = {
  router,
};
