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

export type Phrases = { [key: string]: string };

function* entries(obj: Phrases) {
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

export const formatNestedMessages = (
  phrases: Phrases,
  formattedMessages: Phrases = {},
  prefix = '',
) => {
  const messages = formattedMessages;

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of entries(phrases)) {
    if ({}.hasOwnProperty.call(phrases, key)) {
      const keyWithPrefix = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object') {
        formatNestedMessages(value, formattedMessages, keyWithPrefix);
      } else {
        messages[keyWithPrefix] = value;
      }
    }
  }
  return messages;
};

const NB = {
  name: 'Bokmål',
  abbreviation: 'nb',
  messages: formatNestedMessages({ ...messagesNB, ...nb }),
};
const NN = {
  name: 'Nynorsk',
  abbreviation: 'nn',
  messages: formatNestedMessages({ ...messagesNN, ...nn }),
};
const EN = {
  name: 'English',
  abbreviation: 'en',
  messages: formatNestedMessages({ ...messagesEN, ...en }),
};

export const appLocales = [NB, NN, EN];
export const preferdLocales = [NB, NN, EN];

export const getLocaleObject = (localeAbbreviation: string) => {
  const locale = appLocales.find(appLocale => appLocale.abbreviation === localeAbbreviation);

  return locale || NB; // defaults to NB
};

export const isValidLocale = (localeAbbreviation: string) =>
  appLocales.find(l => l.abbreviation === localeAbbreviation) !== undefined;
