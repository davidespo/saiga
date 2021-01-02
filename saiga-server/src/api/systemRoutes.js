const express = require('express');
const router = express.Router();
const { system, getProject, deleteProject } = require('../db');

router.get('/projects', async (req, res) => {
  const projectCollection = await system.getProjectCollection();
  const payload = await projectCollection.search({});
  payload.content = await Promise.all(
    payload.content.map((project) =>
      getProject(project.projectId).then((p) => p.getInfo()),
    ),
  );
  res.send(payload);
});

router.post('/projects/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const project = await getProject(projectId);
  const info = await project.getInfo();
  res.send(info);
});

router.get('/projects/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const project = await getProject(projectId);
  const info = await project.getInfo();
  res.send(info);
});

router.delete('/projects/:projectId', async (req, res) => {
  const { projectId } = req.params;
  await deleteProject(projectId);
  res.send({ success: true });
});

router.post('/projects/:projectId/:collectionId', async (req, res) => {
  const { projectId, collectionId } = req.params;
  const project = await getProject(projectId);
  await project.getCollection(collectionId);
  res.send({ success: true });
});

router.delete('/projects/:projectId/:collectionId', async (req, res) => {
  const { projectId, collectionId } = req.params;
  const project = await getProject(projectId);
  await project.deleteCollection(collectionId);
  res.send({ success: true });
});

module.exports = {
  router,
};
