/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { resolveJsonOrRejectWithError } from '../../util/apiHelpers';
import config from '../../config';

const baseUrl = `${
  config.ndlaEnvironment === 'test'
    ? 'https://cors-anywhere.herokuapp.com/'
    : ''
}https://monsapi2-jdkp6gp6pa-ew.a.run.app/translate`;

export const fetchNnTranslation = ({ id, ...articleContents }) =>
  fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      token: config.npkToken,
      guid: config.ndlaEnvironment + id,
      document: articleContents,
    }),
  }).then(resolveJsonOrRejectWithError);
