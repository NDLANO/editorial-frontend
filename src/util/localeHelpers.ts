import { LocationState } from 'history';
import { appLocales } from '../i18n';

interface appLocaleType {
  name: string;
  abbreviation: string;
  messages: string[];
}

interface localeUrlsType {
  [key: string]: {
    name: string;
    url: string;
  };
}

const getLocaleURL = (
  newLocale: string,
  locale: string,
  location: Location,
): string => {
  const { pathname, search } = location;
  const basePath = pathname.startsWith(`/${locale}/`)
    ? pathname.replace(`/${locale}/`, '/')
    : pathname;
  return newLocale === 'nb'
    ? `${basePath}${search}`
    : `/${newLocale}${basePath}${search}`;
};

export const getLocaleUrls = (
  locale: string,
  location: Location,
): localeUrlsType => {
  const localeUrls: localeUrlsType = {};
  appLocales.forEach((appLocale: appLocaleType) => {
    localeUrls[appLocale.abbreviation] = {
      name: appLocale.name,
      url:
        appLocale.abbreviation === 'nb'
          ? `/${appLocale.abbreviation}${getLocaleURL(
              appLocale.abbreviation,
              locale,
              location,
            )}`
          : getLocaleURL(appLocale.abbreviation, locale, location),
    };
  });
  return localeUrls;
};
