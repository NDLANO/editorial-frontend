/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { i18n } from "i18next";
import { STORED_LANGUAGE_KEY } from "./constants";
import { LocaleType } from "./interfaces";
import en from "./phrases/phrases-en";
import nb from "./phrases/phrases-nb";
import nn from "./phrases/phrases-nn";

export const supportedLanguages: LocaleType[] = ["nb", "nn", "en"];
export const subjectLanguages: LocaleType[] = ["nb", "nn", "en", "se", "sma"];
export const collectionLanguages: LocaleType[] = ["nb", "nn", "en", "se", "sma", "ukr"];

export const isValidLocale = (localeAbbreviation: string): boolean => {
  return supportedLanguages.includes(localeAbbreviation as LocaleType);
};

export const initializeI18n = (i18n: i18n): void => {
  i18n.options.supportedLngs = supportedLanguages;
  i18n.addResourceBundle("en", "translation", en, true, true);
  i18n.addResourceBundle("nb", "translation", nb, true, true);
  i18n.addResourceBundle("nn", "translation", nn, true, true);

  i18n.on("languageChanged", function (language) {
    if (typeof document != "undefined") {
      document.documentElement.lang = language;
    }
    if (typeof window != "undefined") {
      window.localStorage.setItem(STORED_LANGUAGE_KEY, language);
    }
  });
};
