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
import {
  OK,
  INTERNAL_SERVER_ERROR,
  NOT_ACCEPTABLE,
  FORBIDDEN,
} from 'http-status';
import bodyParser from 'body-parser';
import prettier from 'prettier/standalone';
import parseHTML from 'prettier/parser-html';
import proxy from 'express-http-proxy';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import getConditionalClassnames from './getConditionalClassnames';
import { getLocaleObject } from '../i18n';
import Html from './Html';
import { getToken, getBrightcoveToken, getUsers, getEditors } from './auth';
import contentSecurityPolicy from './contentSecurityPolicy';
import errorLogger from '../util/logger';
import config from '../config';
import { DRAFT_PUBLISH_SCOPE, DRAFT_WRITE_SCOPE } from '../constants';

const app = express();
const allowedBodyContentTypes = ['application/csp-report', 'application/json'];

// Temporal hack to send users to prod
if (config.ndlaEnvironment === 'ff') {
  app.get('*', (req, res, next) => {
    if (req.hostname.startsWith('editorial-frontend')) {
      next();
    } else {
      res.set('location', `https://ed.ndla.no${req.originalUrl}`);
      res.status(302).send();
    }
  });
}

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

app.post('/format-html', (req, res) => {
  const html = prettier.format(req.body.html, {
    parser: 'html',
    printWidth: 1000000, // Avoid inserting linebreaks for long inline texts i.e. <p>Lorem ......... ipsum</p>
    plugins: [parseHTML],
  });
  res.status(OK).json({ html });
});

app.get('/get_brightcove_token', (req, res) => {
  getBrightcoveToken()
    .then(token => {
      res.send(token);
    })
    .catch(err => res.status(INTERNAL_SERVER_ERROR).send(err.message));
});

app.get(
  '/get_note_users',
  jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      jwksUri: `https://${config.auth0Domain}/.well-known/jwks.json`,
    }),
    audience: 'ndla_system',
    issuer: `https://${config.auth0Domain}/`,
    algorithms: ['RS256'],
  }),
  async (req, res) => {
    const {
      user,
      query: { userIds },
    } = req;
    const hasWriteAccess =
      user &&
      user.scope &&
      (user.scope.includes(DRAFT_WRITE_SCOPE) ||
        user.scope.includes(DRAFT_PUBLISH_SCOPE));

    if (!hasWriteAccess) {
      res
        .status(FORBIDDEN)
        .json({ status: FORBIDDEN, text: 'No access allowed' });
    } else {
      try {
        const managementToken = await getToken(
          `https://${config.auth0Domain}/api/v2/`,
        );
        const users = await getUsers(managementToken, userIds);
        res.status(OK).json(users);
      } catch (err) {
        res.status(INTERNAL_SERVER_ERROR).send(err.message);
      }
    }
  },
);

app.get(
  '/get_editors',
  jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      jwksUri: `https://${config.auth0Domain}/.well-known/jwks.json`,
    }),
    audience: 'ndla_system',
    issuer: `https://${config.auth0Domain}/`,
    algorithms: ['RS256'],
  }),
  async (req, res) => {
    const {
      query: { role },
    } = req;

    try {
      const managementToken = await getToken(
        `https://${config.auth0Domain}/api/v2/`,
      );
      const editors = await getEditors(managementToken, role);
      res.status(OK).json(editors);
    } catch (err) {
      res.status(INTERNAL_SERVER_ERROR).send(err.message);
    }
  },
);

app.post('/csp-report', (req, res) => {
  const { body } = req;
  if (body && body['csp-report']) {
    const cspReport = body['csp-report'];
    const errorMessage = `Refused to load the resource because it violates the following Content Security Policy directive: ${cspReport['violated-directive']}`;
    errorLogger.error(errorMessage, cspReport);
    res.status(OK).json({ status: OK, text: 'CSP Error recieved' });
  } else {
    res
      .status(NOT_ACCEPTABLE)
      .json({ status: NOT_ACCEPTABLE, text: 'CSP Error not recieved' });
  }
});

if (process.env.NODE_ENV === 'development') {
  // proxy js request to handle web worker crossorgin issue (only necessary under development)
  app.get('/static/js/*', proxy('http://localhost:3001'));
}

app.get('*', (req, res) => {
  const paths = req.url.split('/');
  const { abbreviation: locale } = getLocaleObject(paths[1]);
  const userAgentString = req.headers['user-agent'];

  const htmlString = renderHtmlString(locale, userAgentString, { locale });
  res.send(`<!doctype html>\n${htmlString}`);
});

export default app;
