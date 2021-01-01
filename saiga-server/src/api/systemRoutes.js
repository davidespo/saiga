const express = require('express');
const router = express.Router();
const { system } = require('../db');

router.get('/projects', async (req, res) => {
  const projectCollection = system.getProjectCollection();
  const payload = await projectCollection.search({});
  res.send(payload);
});

module.exports = {
  router,
};
