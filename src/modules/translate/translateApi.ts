/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ApiTranslateType } from '../../interfaces';
import { resolveJsonOrRejectWithError } from '../../util/apiHelpers';

const baseUrl = '/translate';

export const fetchNnTranslation = ({ ...content }: Record<string, ApiTranslateType>) =>
  fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      document: content,
    }),
  }).then((r) => resolveJsonOrRejectWithError<Record<string, string | string[]>>(r));
