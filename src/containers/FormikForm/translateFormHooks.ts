/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import dot from 'dot-object';
import { merge } from 'lodash';
import { fetchNnTranslation } from '../../modules/translate/translateApi';

/**
 * The translate service requires a json-payload with one level of fields.
 * To support translating nested domain objects, dot-object is used
 * to transform 'podcastMeta.manuscript' to podcastMeta: { manuscript }.
 * Lodash.merge is used to avoid nested translated fields to shadow nested
 * fields in original domain object.
 * Arrays are not supported by the service, so these are converted to strings
 * and then unwrapped after translation.
 */

// Values _most likely_ not used in translated values
const arrayIdent = 'ARRAY:';
const separator = '~~';

export function useTranslateApi(
  element: any,
  setElement: (element: any) => void,
  fields: string[],
) {
  const [translating, setTranslating] = useState(false);

  const pick = (field: string, element: any) => {
    const picked = dot.pick(field, element);
    if (Array.isArray(picked)) {
      return `${arrayIdent}${picked.join(separator)}`;
    }
    return picked;
  };

  const unwrap = (document: JSON) => {
    const doc = JSON.parse(JSON.stringify(document), function(key: string, value: string) {
      if (typeof value === 'string' && value.startsWith(arrayIdent)) {
        return value.slice(arrayIdent.length).split(separator);
      }
      return value;
    });

    return doc;
  };

  const translateToNN = async () => {
    setTranslating(true);
    const payload = fields.reduce((acc, field) => ({ ...acc, [field]: pick(field, element) }), {});
    const translated = await fetchNnTranslation(payload);
    const document = dot.object(unwrap(translated.document));
    setElement({
      ...merge(element, document),
      language: 'nn',
    });
    setTranslating(false);
  };

  return {
    translating,
    translateToNN,
  };
}
