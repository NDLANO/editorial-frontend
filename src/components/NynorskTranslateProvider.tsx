/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { get, merge, set } from "lodash-es";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router";
import { ApiTranslateType } from "../interfaces";
import { fetchNnTranslation } from "../modules/translate/translateApi";

const TranslateContext = createContext<boolean>(false);

interface Props {
  children: ReactNode;
}

export interface TranslateType {
  field: string;
  type: "text" | "html";
}

export const NynorskTranslateProvider = ({ children }: Props) => {
  return <TranslateContext value={true}>{children}</TranslateContext>;
};

export const useTranslateToNN = () => {
  const { selectedLanguage } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [translating, setTranslating] = useState(false);
  const [translatedFields, setTranslatedFields] = useState<string[]>([]);
  const [shouldTranslate, setShouldTranslate] = useState(
    searchParams.get("translate") === "true" && selectedLanguage === "nn",
  );

  useEffect(() => {
    if (searchParams.get("translate") === "true" && selectedLanguage === "nn") {
      setShouldTranslate(true);
    }
  }, [searchParams, selectedLanguage]);

  const translate = useCallback(
    async (element: any, fields: TranslateType[], setElement: (element: any) => void) => {
      setTranslating(true);
      const payload = fields.reduce<Record<string, ApiTranslateType>>((acc, { field, type }) => {
        const content = get(element, field);
        if (content) {
          // Our backend uses Jsoup to encode html. However, > is not encoded, and nynodata expects it to be. As such, we have to parse
          // the entire html string and reencode it using an xmlSerializer.
          acc[field] = { content: content, type };
        }
        return acc;
      }, {});
      const document = await fetchNnTranslation(payload);
      const cloned = JSON.parse(JSON.stringify(element));
      Object.entries(document).forEach(([key, value]) => {
        set(cloned, key, value);
      });
      setShouldTranslate(false);
      setTranslating(false);
      setElement({ ...merge(element, cloned), language: "nn" });
      setTranslatedFields(
        fields.map((field) => {
          const fieldValue = field.field.split(".");
          return fieldValue[fieldValue.length - 1];
        }),
      );
      setSearchParams(
        (params) => {
          params.delete("translate");
          return params;
        },
        { state: location.state, replace: true },
      );
    },
    [location.state, setSearchParams],
  );

  return {
    translating,
    translate,
    translatedFields,
    shouldTranslate,
  };
};

export const useIsTranslatableToNN = () => {
  const context = useContext(TranslateContext);
  return !!context;
};
