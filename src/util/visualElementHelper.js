import { convertFieldWithFallback } from './convertFieldWithFallback';

export function getVisualElementInformation(element, type) {
  switch (type) {
    case 'image':
      return {
        title: convertFieldWithFallback(element, 'title', ''),
        copyright:
          element.copyright && element.copyright.creators
            ? element.copyright.creators.map((creator) => creator.name).join(', ')
            : undefined,
      };
    case 'brightcove': {
      const copyrightsKeys = element.custom_fields
        ? Object.keys(element.custom_fields).filter((key) => key.includes('licenseinfo'))
        : [];
      const copyrights = copyrightsKeys
        .map((key) => {
          const licenseinfo = element.custom_fields[key];
          return licenseinfo.includes(':') ? licenseinfo.split(':')[1] : licenseinfo;
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

export const imageToVisualElement = (image) => {
  return {
    resource: 'image',
    resource_id: image.id,
    size: image.size,
    align: '',
    alt: convertFieldWithFallback(image, 'alttext', ''),
    caption: convertFieldWithFallback(image, 'caption', ''),
    url: image.imageUrl,
    metaData: image,
  };
};
