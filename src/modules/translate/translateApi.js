/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { resolveJsonOrRejectWithError } from '../../util/apiHelpers';
import config from '../../config';

const baseUrl = 'https://nynorsk.cloud/translate';

export const fetchNnTranslation = ({ id, ...content }) =>
  fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      token: config.npkToken,
      guid: config.ndlaEnvironment + '_' + id,
      prefs: { x: true }, // Hack to tell the service to use old html-parser, ref jo.christian.oterhals@ntb.no
      document: content,
      fileType: 'htmlp', // Tells old html-parser to skip changing æøå to entities.
    }),
  }).then(resolveJsonOrRejectWithError);
