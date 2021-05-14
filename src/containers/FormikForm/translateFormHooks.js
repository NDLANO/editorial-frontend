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

export function useTranslateApi(element, setElement, fields = {}) {
  const [translating, setTranslating] = useState(false);

  const translateFunc = async () => {
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
    translateFunc,
  };
}
