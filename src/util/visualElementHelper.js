import { titlesI18N } from './i18nFieldFinder';

export function getVisualElementInformation(element, type, locale) {
  switch (type) {
    case 'image':
      return {
        title: titlesI18N(element, locale, true),
        copyright:
          element.copyright && element.copyright.authors
            ? element.copyright.authors.map(author => author.name).join(', ')
            : undefined,
      };
    case 'brightcove': {
      const copyrightsKeys = element.custom_fields
        ? Object.keys(element.custom_fields).filter(key =>
            key.includes('licenseinfo'),
          )
        : [];
      const copyrights = copyrightsKeys
        .map(key => {
          const licenseinfo = element.custom_fields[key];
          return licenseinfo.includes(':')
            ? licenseinfo.split(':')[1]
            : licenseinfo;
        })
        .join(', ');
      return {
        title: element.name,
        copyright: copyrights,
      };
    }
    default:
      return {
        title: 'Ukjent',
        copyright: 'Ukjent',
      };
  }
}
