/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const handleError = (error: any, ...rest: any[]) => {
  if (import.meta.env.PROD) {
    window.errorReporter.captureError(error);
    // No logging when unit testing
  } else if (import.meta.env.MODE !== 'test') {
    console.error(error, ...rest); // eslint-disable-line no-console
  }
};
export default handleError;
