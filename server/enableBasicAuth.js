/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const basicAuth = require('express-basic-auth');

export default function enableBasicAuth(app) {
  app.use(
    basicAuth({
      users: { admin: '!NDLA' },
      challenge: true,
      realm: 'editorial-frontend.test',
    }),
  );
}
