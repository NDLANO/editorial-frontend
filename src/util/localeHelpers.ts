/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Location } from 'react-router-dom';
import { LOCALE_VALUES } from '../constants';
import { appLocales } from '../i18n';
import { LocaleType } from '../interfaces';

interface appLocaleType {
  name: string;
  abbreviation: string;
}

interface localeUrlsType {
  [key: string]: {
    name: string;
    url: string;
  };
}

export const stringToLocale = (stringLanguage?: string): LocaleType | undefined => {
  return LOCALE_VALUES.find((lv) => lv === stringLanguage);
};

const getLocaleURL = (newLocale: string, locale: string, location: Location): string => {
  const { pathname, search } = location;
  const basePath = pathname.startsWith(`/${locale}/`)
    ? pathname.replace(`/${locale}/`, '/')
    : pathname;
  return newLocale === 'nb' ? `${basePath}${search}` : `/${newLocale}${basePath}${search}`;
};

export const getLocaleUrls = (locale: string, location: Location): localeUrlsType => {
  const localeUrls: localeUrlsType = {};
  appLocales.forEach((appLocale: appLocaleType) => {
    localeUrls[appLocale.abbreviation] = {
      name: appLocale.name,
      url:
        appLocale.abbreviation === 'nb'
          ? `/${appLocale.abbreviation}${getLocaleURL(appLocale.abbreviation, locale, location)}`
          : getLocaleURL(appLocale.abbreviation, locale, location),
    };
  });
  return localeUrls;
};
