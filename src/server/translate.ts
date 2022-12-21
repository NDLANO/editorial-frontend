/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'cross-fetch';
import queryString from 'query-string';

const url = 'https://ndla.norskrobot.no:3443/translateText';

type doc = Record<string, string>;

export const translateDocument = async (document: doc) => {
  const translations = await Promise.allSettled(
    Object.keys(document).map(element => {
      const params = {
        stilmal: 'Moderat nynorsk',
        q: document[element],
      };
      console.log(`${url}?${queryString.stringify(params)}`);
      return fetch(`${url}?${queryString.stringify(params)}`, {
        method: 'POST',
      })
        .then(res => res.json())
        .catch(err => {
          console.log(err);
        });
    }),
  );
  console.log(translations);
  return translations;
};
