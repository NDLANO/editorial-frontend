/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import express from 'express';
import compression from 'compression';
import robots from 'express-robots';

import Auth0SilentCallback from './Auth0SilentCallback';
import enableDevMiddleWare from './enableDevMiddleware';
import enableBasicAuth from './enableBasicAuth';
import getConditionalClassnames from './getConditionalClassnames';
import { getLocaleObject } from '../src/i18n';
import Html from './Html';
import { getToken, getBrightcoveToken } from './auth';

const app = express();

if (process.env.NODE_ENV === 'development') {
  enableDevMiddleWare(app);
}

if (process.env.NDLA_ENVIRONMENT === 'test') {
  enableBasicAuth(app);
}

app.use(robots({ UserAgent: '*', Disallow: '/' }));
app.use(compression());
app.use(
  express.static('htdocs', {
    maxAge: 1000 * 60 * 60 * 24 * 365, // One year
  }),
);

const renderHtmlString = (locale, userAgentString, state = {}) =>
  renderToString(
    <Html
      lang={locale}
      state={state}
      className={getConditionalClassnames(userAgentString)}
    />,
  );

app.get('/health', (req, res) => {
  res.status(200).json({ status: 200, text: 'Health check ok' });
});

app.get('/login/silent-callback', (req, res) => {
  res.send('<!doctype html>\n' + Auth0SilentCallback); // eslint-disable-line
});

app.get('/get_token', (req, res) => {
  getToken()
    .then(token => {
      res.send(token);
    })
    .catch(err => res.status(500).send(err.message));
});

app.get('/get_brightcove_token', (req, res) => {
  getBrightcoveToken()
    .then(token => {
      res.send(token);
    })
    .catch(err => res.status(500).send(err.message));
});

app.get('*', (req, res) => {
  const paths = req.url.split('/');
  const { abbreviation: locale } = getLocaleObject(paths[1]);
  const userAgentString = req.headers['user-agent'];

  const htmlString = renderHtmlString(locale, userAgentString, { locale });
  res.send(`<!doctype html>\n${htmlString}`);
});

module.exports = app;
