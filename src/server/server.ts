/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fs from 'fs/promises';
import { join } from 'path';
import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import proxy from 'express-http-proxy';
import helmet from 'helmet';
import serialize from 'serialize-javascript';
import { ViteDevServer } from 'vite';
import api from './api';
import contentSecurityPolicy from './contentSecurityPolicy';
import config from '../config';

const isProduction = process.env.NODE_ENV === 'production';
const base = process.env.BASE || '/';

const app = express();
// Cached production assets
// Vercel is particular about how it reads files. Changing this might break the build.
const templateHtml = isProduction
  ? await fs.readFile(join(process.cwd(), 'build', 'public', 'index.html'), 'utf-8')
  : '';

let vite: ViteDevServer | undefined;
if (!isProduction) {
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  });
  app.use(vite.middlewares);
} else {
  const sirv = (await import('sirv')).default;
  app.use(base, sirv('./build/public', { extensions: [] }));
}

const allowedBodyContentTypes = ['application/csp-report', 'application/json'];

// Temporal hack to send users to prod
app.get('*', (req, res, next) => {
  if (!req.hostname.includes('ed.ff')) {
    next();
  } else {
    res.set('location', `https://ed.ndla.no${req.originalUrl}`);
    res.status(302).send();
  }
});

if (process.env.IS_VERCEL === 'false') {
  app.use(compression());
}
app.use(express.json({ limit: '1mb' }));
// app.use(
//   express.static(process.env.PUBLIC_DIR, {
//     maxAge: 1000 * 60 * 60 * 24 * 365, // One year
//   }),
// );
app.use(express.json());

app.use(
  bodyParser.json({
    type: (req) => {
      const contentType = req.headers['content-type'];
      if (typeof contentType === 'string') return allowedBodyContentTypes.includes(contentType);
      else return false;
    },
  }),
);

app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
    },
    contentSecurityPolicy: process.env.DISABLE_CSP === 'true' ? null : contentSecurityPolicy,
    frameguard:
      process.env.NODE_ENV === 'development'
        ? {
            action: 'allow-from',
            domain: '*://localhost',
          }
        : undefined,
  }),
);

if (process.env.NODE_ENV === 'development') {
  // proxy js request to handle web worker crossorgin issue (only necessary under development)
  app.get('/static/js/*', proxy('http://localhost:3001'));
}

app.use(api);

app.get('*', async (req, res) => {
  const paths = req.url.split('/');
  try {
    const url = req.originalUrl.replace(base, '');

    let template;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8');
      template = await vite!.transformIndexHtml(url, template);
    } else {
      template = templateHtml;
    }

    const html = template
      .replace("'__CONFIG__'", serialize(config))
      .replaceAll('__ENVIRONMENT__', process.env.NDLA_ENVIRONMENT ?? 'test');

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  } catch (e) {
    //@ts-ignore
    vite?.ssrFixStacktrace(e);
    //@ts-ignore
    // eslint-disable-next-line no-console
    console.log(e.stack);
    //@ts-ignore
    res.status(500).end(e.stack);
  }
});

export default app;
