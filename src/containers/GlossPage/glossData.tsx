/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const LANGUAGES = ["ar", "de", "en", "es", "nb", "nn", "se", "sma", "so", "ti", "zh"];

export const ROMANIZATION_OPTIONS = ["traditional", "pinyin"] as const;

export const emptyGlossExample = {
  example: "",
  language: "",
  transcriptions: {},
};
