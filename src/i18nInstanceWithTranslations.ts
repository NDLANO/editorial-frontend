/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { messagesEN, messagesNB, messagesNN } from "@ndla/ui";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import config from "./config";
import { SUPPORTED_LANGUAGES } from "./constants";

// for some stupid reason, this needs to be in its own file. initReacti18next struggles to bind
// to the actual instance if we do it in other ways.

const i18nInstanceWithTranslations = createInstance().use(initReactI18next);

i18nInstanceWithTranslations.init({
  fallbackLng: config.defaultLanguage,
  supportedLngs: SUPPORTED_LANGUAGES,
  resources: {
    en: {
      translation: messagesEN,
    },
    nn: {
      translation: messagesNN,
    },
    nb: {
      translation: messagesNB,
    },
  },
});

export { i18nInstanceWithTranslations };
