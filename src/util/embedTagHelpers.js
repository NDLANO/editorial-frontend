/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import isObject from 'lodash/fp/isObject';

import { isEmpty } from '../components/validators';

export const reduceElementDataAttributes = el => {
  const attrs = [].slice.call(el.attributes);
  const obj = attrs.reduce(
    (all, attr) =>
      Object.assign({}, all, { [attr.name.replace('data-', '')]: attr.value }),
    {},
  );
  return obj;
};
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

  const obj = reduceElementDataAttributes(embedElements[0]);
  delete obj.id;
  return { ...obj, metaData: {} };
};

export const createEmbedTag = visualElement => {
  const embed = document.createElement('embed');
  Object.keys(visualElement)
    .filter(
      key => visualElement[key] !== undefined && !isObject(visualElement[key]),
    )
    .forEach(key => embed.setAttribute(`data-${key}`, visualElement[key]));
  return embed.outerHTML;
};

export const isUserProvidedEmbedDataValid = embed => {
  if (embed.resource === 'image') {
    return !isEmpty(embed.alt) && !isEmpty(embed.caption);
  } else if (embed.resource === 'brightcove') {
    return !isEmpty(embed.caption);
  } else if (embed.resource === 'audio') {
    return !isEmpty(embed.caption);
  }
  return true;
};
