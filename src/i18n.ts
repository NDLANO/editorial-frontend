/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// @ts-ignore
import { messagesNB, messagesEN, messagesNN } from '@ndla/ui';
import nb from './phrases/phrases-nb';
import nn from './phrases/phrases-nn';
import en from './phrases/phrases-en';

type NestedPhrases = { [key: string]: NestedPhrases | string };
export type FormattedMessages = { [key: string]: string };

export const formatNestedMessages = (
  phrases: NestedPhrases,
  formattedMessages: NestedPhrases = {},
  prefix: string = '',
): FormattedMessages => {
  const messages = formattedMessages;
  for (let key in phrases) {
    if (phrases.hasOwnProperty(key)) {
      const keyWithPrefix = prefix ? `${prefix}.${key}` : key;
      const value: NestedPhrases | string = phrases[key];
      if (typeof value === 'string') {
        messages[keyWithPrefix] = value;
      } else {
        formatNestedMessages(value, formattedMessages, keyWithPrefix);
      }
    }
  }

  return messages as FormattedMessages;
};

interface LocaleObject {
  name: string;
  abbreviation: string;
  messages: FormattedMessages;
}

const NB: LocaleObject = {
  name: 'Bokmål',
  abbreviation: 'nb',
  messages: formatNestedMessages({ ...messagesNB, ...nb }),
};

const NN: LocaleObject = {
  name: 'Nynorsk',
  abbreviation: 'nn',
  messages: formatNestedMessages({ ...messagesNN, ...nn }),
};

const EN: LocaleObject = {
  name: 'English',
  abbreviation: 'en',
  messages: formatNestedMessages({ ...messagesEN, ...en }),
};

export const appLocales: LocaleObject[] = [NB, NN, EN];
export const preferdLocales: LocaleObject[] = [NB, NN, EN];

export const getLocaleObject = (localeAbbreviation: string): LocaleObject => {
  const locale = appLocales.find(appLocale => appLocale.abbreviation === localeAbbreviation);

  return locale || NB; // defaults to NB
};

export const isValidLocale = (localeAbbreviation: string): boolean => {
  return appLocales.find(l => l.abbreviation === localeAbbreviation) !== undefined;
};
