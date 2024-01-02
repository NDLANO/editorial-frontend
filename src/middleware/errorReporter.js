/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import handleError from '../util/handleError';

const errorReporter = (store) => (next) => (action) => {
  if (action.error) {
    const err = action.payload;
    if (err.status) {
      const { json } = err;
      // eslint-disable-next-line no-console
      handleError(`${err.status} ${err.message}: ${json.code} ${json.description}. %o`, json.messages);
    } else {
      handleError(action.payload, action, store.getState()); // eslint-disable-line no-console
    }
  }

  return next(action);
};

export default errorReporter;
