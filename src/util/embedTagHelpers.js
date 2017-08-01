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
    id:
      getAttribute('resource_id') ||
      getAttribute('videoid') ||
      getAttribute('id'),
    alt: getAttribute('alt'),
    caption: getAttribute('caption'),
    url: getAttribute('url'),
    resource: getAttribute('resource'),
  };
};
