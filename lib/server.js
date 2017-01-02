const express = require('express');
const path = require('path');
const fs = require('fs');

const BUILD_DIR = path.join(__dirname, '..', 'build');
const appPath = path.join(BUILD_DIR, 'server-bundle');

const Routes = require(appPath).default;

const STATIC_DIR = path.join(BUILD_DIR, 'static');
const PORT = 4000;
const indexHtml = fs.readFileSync(path.join(BUILD_DIR, 'index.html'), 'utf-8');

const app = express();

app.use('/static', express.static(STATIC_DIR));

app.get('*', (req, res) => {
  res.send(indexHtml);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
