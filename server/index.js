#!/usr/bin/env node
/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const http = require('http');

require('babel-register');
require('babel-polyfill');

const config = require('../src/config');
const serverConfig = require('./server');
const redirectConfig = require('./redirect');

const server = http.createServer(serverConfig);

server.listen(config.port);
server.on('listening', () => {
  console.log(`Listening on ${config.port}`);
});

if (process.env.NOW !== 'true') {
  const redirectServer = http.createServer(redirectConfig);
  // If port is 79 the request has been dispatched with http protocol from ELB. Redirecting to https.
  redirectServer.listen(config.redirectPort);
  redirectServer.on('listening', () => {
    console.log(`Listening for redirects on ${config.redirectPort}`);
  });
}
