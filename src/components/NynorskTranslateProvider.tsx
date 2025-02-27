/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { get, merge, set } from "lodash-es";
import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiTranslateType } from "../interfaces";
import { fetchNnTranslation } from "../modules/translate/translateApi";

const TranslateContext = createContext<[boolean, Dispatch<SetStateAction<boolean>>] | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export interface TranslateType {
  field: string;
  type: "text" | "html";
}

const domParser = new DOMParser();
const xmlSerializer = new XMLSerializer();

export const NynorskTranslateProvider = ({ children }: Props) => {
  const translateState = useState<boolean>(false);
  return <TranslateContext.Provider value={translateState}>{children}</TranslateContext.Provider>;
};

const errorMessage = "useTranslateToNN must be used within a NynorskTranslateProvider";

export const useTranslateToNN = () => {
  const translateContext = useContext(TranslateContext);
  const { selectedLanguage } = useParams();
  const [translating, setTranslating] = useState(false);
  const shouldTranslate = useMemo(
    () => (translateContext?.[0] ? selectedLanguage === "nn" : false),
    [translateContext, selectedLanguage],
  );

  const setShouldTranslate = useCallback(
    (shouldTranslate: boolean) => {
      if (translateContext === undefined) {
        throw new Error(errorMessage);
      }
      translateContext[1](shouldTranslate);
    },
    [translateContext],
  );

  const translate = useCallback(
    async (element: any, fields: TranslateType[], setElement: (element: any) => void) => {
      if (translateContext === undefined) {
        throw new Error("translate must be used within a NynorskTranslateProvider");
      }
      setTranslating(true);
      const payload = fields.reduce<Record<string, ApiTranslateType>>((acc, { field, type }) => {
        const content = get(element, field);
        if (content) {
          const isArray = Array.isArray(content);
          // Our backend uses Jsoup to encode html. However, > is not encoded, and nynodata expects it to be. As such, we have to parse
          // the entire html string and reencode it using an xmlSerializer.
          const parsed =
            type === "html" && !isArray
              ? xmlSerializer.serializeToString(domParser.parseFromString(content, "text/html").body!)
              : content;
          acc[field] = { content: parsed, type, isArray };
        }
        return acc;
      }, {});
      const document = await fetchNnTranslation(payload);
      const cloned = JSON.parse(JSON.stringify(element));
      Object.entries(document).forEach(([key, value]) => {
        const isHtml = fields.find((field) => field.field === key && field.type === "html");
        // Remove XML traces for html fields
        const parsed =
          isHtml && !Array.isArray(value)
            ? value
                .replace(/\sxmlns=".*?"/g, "")
                .replace(/&?lt;/g, "<")
                .replace(/&?gt;/g, ">")
                .replace(/<\/?body>/g, "")
            : value;
        set(cloned, key, parsed);
      });
      setElement({ ...merge(element, cloned), language: "nn" });
      setTranslating(false);
      translateContext[1](false);
    },
    [translateContext],
  );

  return {
    translating,
    translate,
    shouldTranslate,
    setShouldTranslate,
  };
};

export const useIsTranslatableToNN = () => {
  const context = useContext(TranslateContext);
  return !!context;
};
