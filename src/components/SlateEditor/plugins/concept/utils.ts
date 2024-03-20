/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IGlossData, IGlossExample } from "@ndla/types-backend/concept-api";

export const generateNumbersArray = (arrayLength: number): string[] =>
  Array.from(Array(arrayLength).keys()).map((el) => el.toString());

export const generateUniqueGlossLanguageArray = (glossExamples: IGlossExample[][]): string[] =>
  Array.from(new Set(glossExamples.flat().map((e) => e.language)));

interface GlossDataAttributes {
  exampleIds?: string;
  exampleLangs?: string;
}

export const getGlossDataAttributes = (
  glossData: IGlossData,
  locale: string,
  excludeKeys: (keyof GlossDataAttributes)[] = [],
): GlossDataAttributes => {
  // If the locale is "nb" and the language is "nn" or vice versa, the language should be filtered out
  return {
    ...(!excludeKeys.includes("exampleIds")
      ? { exampleIds: generateNumbersArray(glossData.examples.length).join(",") }
      : {}),
    ...(!excludeKeys.includes("exampleLangs")
      ? {
          exampleLangs: generateUniqueGlossLanguageArray(glossData.examples)
            .filter((lang) => {
              if (locale === "nb") return lang !== "nn";
              if (locale === "nn") return lang !== "nb";
              return true;
            })
            .join(","),
        }
      : {}),
  };
};
