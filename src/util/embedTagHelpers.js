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
  const getAttribute = name => embedElements[0].getAttribute(`data-${name}`);
  return {
    id: getAttribute('resource_id') || getAttribute('videoid'),
    alt: getAttribute('alt'),
    caption: getAttribute('caption'),
    url: getAttribute('url'),
    resource: getAttribute('resource'),
  };
};

export const createEmbedTag = (id, type, caption = '', alt = '') => {
  if (type === 'h5p') {
    return `<embed data-resource="${type}" data-url="${id}">`;
  } else if (type === 'brightcove') {
    return `<embed data-resource="${type}" data-caption=${caption} data-videoid=="${id}">`;
  } else if (type === 'image') {
    return `<embed data-size="fullbredde" data-resource="${type}" data-alt=${alt} data-caption=${caption} data-resource_id=="${id}">`;
  }
  console.error('Unkown embed tag type');
  return '';
};
