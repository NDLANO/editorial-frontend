/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const parseEmbedTag = embedTag => {
  if (embedTag === '') {
    return undefined;
  }

  const el = document.createElement('html');
  el.innerHTML = embedTag;
  const embedElements = el.getElementsByTagName('embed');

  if (embedElements.length !== 1) {
    return undefined;
  }
  const attrs = [].slice.call(embedElements[0].attributes);
  const obj = attrs.reduce(
    (all, attr) =>
      Object.assign({}, all, { [attr.name.replace('data-', '')]: attr.value }),
    {},
  );
  delete obj.id;
  return { ...obj, metaData: {} };
};

export const createEmbedTag = visualElement => {
  if (visualElement.resource === 'h5p') {
    return `<embed data-resource="${visualElement.resource}" data-url="${visualElement.url}">`;
  } else if (visualElement.resource === 'brightcove') {
    return `<embed data-resource="${visualElement.resource}" data-caption=${visualElement.caption} data-videoid="${visualElement.videoid}">`;
  } else if (visualElement.resource === 'image') {
    return `<embed data-size="fullbredde" data-align="" data-resource="${visualElement.resource}" data-alt=${visualElement.alt} data-caption=${visualElement.caption} data-resource_id="${visualElement.resource_id}">`;
  }
  console.error('Unkown embed tag type');
  return '';
};
