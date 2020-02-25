/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { resolveJsonOrRejectWithError } from '../../util/apiHelpers';

const baseUrl = 'https://cors-anywhere.herokuapp.com/https://monsapi2-jdkp6gp6pa-ew.a.run.app/translate';

export const fetchNnTranslation = (articleContents) => {
  const body = {
    token: "",
    document: articleContents
  }
  
  return fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(body) 
  })
  .then(resolveJsonOrRejectWithError);
}

