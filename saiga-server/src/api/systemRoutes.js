const express = require('express');
const router = express.Router();
const { system, getProject } = require('../db');

router.get('/projects', async (req, res) => {
  const projectCollection = system.getProjectCollection();
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
  // TODO: cleanup
  const projectCollection = system.getProjectCollection();
  await projectCollection.remove(projectId);
  res.send({ success: true });
});

module.exports = {
  router,
};
