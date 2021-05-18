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
 */

export function useTranslateApi(element: any, setElement: (type: any) => void, fields = {}) {
  const [translating, setTranslating] = useState(false);

  const translateToNN = async () => {
    setTranslating(true);

    const translatedContents = await fetchNnTranslation({ ...fields });
    const document = dot.object(translatedContents.document);
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
