/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { LocaleType } from "./interfaces";
import en from "./phrases/phrases-en";
import nb from "./phrases/phrases-nb";
import nn from "./phrases/phrases-nn";
import { i18nInstanceWithTranslations } from "./i18nInstanceWithTranslations";
import { SUPPORTED_LANGUAGES } from "./constants";

export const subjectLanguages: LocaleType[] = ["nb", "nn", "en", "se", "sma"];
export const collectionLanguages: LocaleType[] = ["nb", "nn", "en", "se", "sma", "ukr"];

export const isValidLocale = (localeAbbreviation: string): boolean => {
  return SUPPORTED_LANGUAGES.includes(localeAbbreviation as LocaleType);
};

export const initializeI18n = (language: string) => {
  const instance = i18nInstanceWithTranslations.cloneInstance({
    lng: language,
    supportedLngs: SUPPORTED_LANGUAGES,
  });
  instance.addResourceBundle("en", "translation", en, true, true);
  instance.addResourceBundle("nb", "translation", nb, true, true);
  instance.addResourceBundle("nn", "translation", nn, true, true);
  document.documentElement.lang = language;
  return instance;
};
