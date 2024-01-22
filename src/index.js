/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// This is the entry point of the application.
// The only purpose of this file is to support deploying to vercel. Removing it *will* break vercel deploys.

import config from './config';
import app from './server/server';

if (!config.isVercel) {
  // Start http server
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started at http://localhost:${config.port}`);
  });
}

export default app;
