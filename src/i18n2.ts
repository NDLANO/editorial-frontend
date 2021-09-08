import { i18n } from 'i18next';
import nb from './phrases/phrases-nb';
import nn from './phrases/phrases-nn';
import en from './phrases/phrases-en';
import { STORED_LANGUAGE_KEY } from './constants';

import { LocaleType } from './interfaces';

export const supportedLanguages: LocaleType[] = ['nb', 'nn', 'en'];

export const initializeI18n = (i18n: i18n): void => {
  i18n.options.supportedLngs = supportedLanguages;
  i18n.addResourceBundle('en', 'translation', en, true, true);
  i18n.addResourceBundle('nb', 'translation', nb, true, true);
  i18n.addResourceBundle('nn', 'translation', nn, true, true);

  i18n.on('languageChanged', function(language) {
    if (typeof document != 'undefined') {
      document.documentElement.lang = language;
    }
    if (typeof window != 'undefined') {
      window.localStorage.setItem(STORED_LANGUAGE_KEY, language);
    }
  });
};
