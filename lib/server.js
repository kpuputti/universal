const express = require('express');
const path = require('path');
const fs = require('fs');
const React = require('react');
const { renderToString } = require('react-dom/server');
const { ServerRouter, createServerRenderContext } = require('react-router');

const BUILD_DIR = path.join(__dirname, '..', 'build');
const appPath = path.join(BUILD_DIR, 'server-bundle');

const Routes = require(appPath).default;

const STATIC_DIR = path.join(BUILD_DIR, 'static');
const PORT = 4000;
const indexHtml = fs.readFileSync(path.join(BUILD_DIR, 'index.html'), 'utf-8');

const app = express();

function render(location, context) {
  return renderToString(
    React.createElement(
      ServerRouter,
      { location, context },
      React.createElement(Routes)
    )
  );
}

app.use('/static', express.static(STATIC_DIR));

app.get('*', (req, res) => {

  const context = createServerRenderContext();
  const html = render(req.url, context);
  const result = context.getResult();

  if (result.redirect) {
    res.redirect(result.redirect.pathname);
  } else if (result.missed) {
    // Do a second render pass with the context to clue <Miss>
    // components into rendering this time.
    // See: https://react-router.now.sh/ServerRouter
    const reHtml = render(req.url, context);
    res.status(404).send(indexHtml.replace('%APP%', reHtml));
  } else {
    res.send(indexHtml.replace('%APP%', html));
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
