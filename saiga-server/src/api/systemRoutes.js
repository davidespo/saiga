const express = require('express');
const router = express.Router();
const { system } = require('../db');

const sendNotFound = (res) =>
  res.status(404).send({ success: false, message: 'Not Found' });

/*
 *     LIST
 */
router.get('/projects', async (req, res) => {
  const projectCollection = await system.getProjectCollection();
  const payload = await projectCollection.search({});
  payload.content = await Promise.all(
    payload.content.map((project) =>
      system.getProject(project._id).then((p) => p.getInfo()),
    ),
  );
  res.send(payload);
});

/*
 *     SEARCH
 */
router.post('/projects/_search', async (req, res) => {
  const { filter, limit, reverse } = req.body;
  const projectCollection = await system.getProjectCollection();
  const payload = await projectCollection.search({ filter, limit, reverse });
  payload.content = await Promise.all(
    payload.content.map((project) =>
      system.getProject(project._id).then((p) => p.getInfo()),
    ),
  );
  res.send(payload);
});

/*
 *     UPSERT
 */
router.post('/projects/:pid', async (req, res) => {
  const { pid } = req.params;
  const project = await system.createProject(pid);
  const info = await project.getInfo();
  res.send(info);
});

/*
 *     DETAILS
 */
router.get('/projects/:pid', async (req, res) => {
  const { pid } = req.params;
  const project = await system.getProject(pid);
  if (!!project) {
    const info = await project.getInfo();
    res.send(info);
  } else {
    sendNotFound(res);
  }
});

/*
 *     DELETE
 */
router.delete('/projects/:pid', async (req, res) => {
  const { pid } = req.params;
  const project = await system.getProject(pid);
  if (!!project) {
    await system.deleteProject(pid);
    res.send({ success: true });
  } else {
    sendNotFound(res);
  }
});

/*
 *     ADD COLLECTION
 */
router.post('/projects/:projectId/:collectionId', async (req, res) => {
  const { projectId, collectionId } = req.params;
  const project = await system.getOrCreateProject(projectId);
  await project.createCollection(collectionId);
  res.send({ success: true });
});

/*
 *     DELETE COLLECTION
 */
router.delete('/projects/:projectId/:collectionId', async (req, res) => {
  const { projectId, collectionId } = req.params;
  const project = await system.getProject(projectId);
  if (!!project) {
    await project.deleteCollection(collectionId);
    res.send({ success: true });
  } else {
    sendNotFound(res);
  }
});

module.exports = {
  router,
};
