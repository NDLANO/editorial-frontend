/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { get, merge, set } from "lodash-es";
import { useCallback, useEffect, useState } from "react";
import { ApiTranslateType } from "../../interfaces";
import { fetchNnTranslation } from "../../modules/translate/translateApi";

/**
 * The translate service requires a json-payload with one level of fields.
 * To support translating nested domain objects, dot-object is used
 * to transform 'podcastMeta.manuscript' to podcastMeta: { manuscript }.
 * Lodash.merge is used to avoid nested translated fields to shadow nested
 * fields in original domain object.
 * Arrays are not supported by the service, so these are converted to strings
 * and then unwrapped after translation.
 */

interface TranslateType {
  field: string;
  type: "text" | "html";
}

export function useTranslateApi(
  element: any,
  setElement: (element: any) => void,
  fields: TranslateType[],
  disabled?: boolean,
) {
  const [shouldTranslate, setShouldTranslate] = useState(false);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    (async () => {
      if (!shouldTranslate || disabled) return;
      setTranslating(true);
      const payload = fields.reduce<Record<string, ApiTranslateType>>((acc, { field, type }) => {
        const content = get(element, field);
        if (content) {
          acc[field] = { content, type, isArray: Array.isArray(content) };
        }
        return acc;
      }, {});
      const document = await fetchNnTranslation(payload);
      const cloned = JSON.parse(JSON.stringify(element));
      Object.entries(document).forEach(([key, value]) => set(cloned, key, value));
      setElement({ ...merge(element, cloned), language: "nn" });
      setTranslating(false);
      setShouldTranslate(false);
    })();
  }, [shouldTranslate, disabled, fields, element, setElement]);

  const translateToNN = useCallback(() => {
    setShouldTranslate(true);
  }, []);

  return {
    translating,
    translateToNN,
  };
}
