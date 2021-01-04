const express = require('express');
const cors = require('cors');
const { router: systemRouter } = require('./systemRoutes.js');
const { router: dataRouter } = require('./dataRoutes.js');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/system', systemRouter);
app.use('/api/data', dataRouter);

function run() {
  return new Promise((res, rej) => {
    app.listen(PORT, (err) => {
      if (!!err) {
        rej(err);
      } else {
        console.log(`Listening on port ${PORT}`);
      }
    });
  });
}

module.exports = { app, run };
