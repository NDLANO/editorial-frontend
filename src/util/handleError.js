/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export default (error, ...rest) => {
  if (process.env.NODE_ENV === 'production') {
    window.errorReporter.captureError(error);
    // No logging when unit testing
  } else if (process.env.NODE_ENV !== 'unittest') {
    console.error(error, ...rest); // eslint-disable-line no-console
  }
};
