/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from '../config';

const handleError = (error: any, ...rest: any[]) => {
  if (config.runtimeType === 'production') {
    window.errorReporter.captureError(error);
    // No logging when unit testing
  } else if (config.runtimeType !== 'test') {
    console.error(error, ...rest); // eslint-disable-line no-console
  }
};
export default handleError;
