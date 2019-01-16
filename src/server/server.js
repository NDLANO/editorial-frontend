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
import helmet from 'helmet';
import { OK, INTERNAL_SERVER_ERROR, NOT_ACCEPTABLE } from 'http-status';
import bodyParser from 'body-parser';
import Auth0SilentCallback from './Auth0SilentCallback';
import getConditionalClassnames from './getConditionalClassnames';
import { getLocaleObject } from '../i18n';
import Html from './Html';
import { getToken, getBrightcoveToken } from './auth';
import contentSecurityPolicy from './contentSecurityPolicy';
import errorLogger from '../util/logger';

const app = express();
const allowedBodyContentTypes = ['application/csp-report', 'application/json'];

app.use(compression());
app.use(
  express.static(process.env.RAZZLE_PUBLIC_DIR, {
    maxAge: 1000 * 60 * 60 * 24 * 365, // One year
  }),
);

app.use(
  bodyParser.json({
    type: req => allowedBodyContentTypes.includes(req.headers['content-type']),
  }),
);

app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
    },
    contentSecurityPolicy,
    frameguard:
      process.env.NODE_ENV === 'development'
        ? {
            action: 'allow-from',
            domain: '*://localhost',
          }
        : undefined,
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

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /');
});

app.get('/health', (req, res) => {
  res.status(OK).json({ status: OK, text: 'Health check ok' });
});

app.get('/login/silent-callback', (req, res) => {
  res.send('<!doctype html>\n' + Auth0SilentCallback); // eslint-disable-line
});

app.get('/get_token', (req, res) => {
  getToken()
    .then(token => {
      res.send(token);
    })
    .catch(err => res.status(INTERNAL_SERVER_ERROR).send(err.message));
});

app.get('/get_brightcove_token', (req, res) => {
  getBrightcoveToken()
    .then(token => {
      res.send(token);
    })
    .catch(err => res.status(INTERNAL_SERVER_ERROR).send(err.message));
});

app.post('/csp-report', (req, res) => {
  const { body } = req;
  if (body && body['csp-report']) {
    const cspReport = body['csp-report'];
    const errorMessage = `Refused to load the resource because it violates the following Content Security Policy directive: ${
      cspReport['violated-directive']
    }`;
    errorLogger.error(errorMessage, cspReport);
    res.status(OK).json({ status: OK, text: 'CSP Error recieved' });
  } else {
    res
      .status(NOT_ACCEPTABLE)
      .json({ status: NOT_ACCEPTABLE, text: 'CSP Error not recieved' });
  }
});

app.get('*', (req, res) => {
  const paths = req.url.split('/');
  const { abbreviation: locale } = getLocaleObject(paths[1]);
  const userAgentString = req.headers['user-agent'];

  const htmlString = renderHtmlString(locale, userAgentString, { locale });
  res.send(`<!doctype html>\n${htmlString}`);
});

export default app;
