/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import isObject from 'lodash/fp/isObject';

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
  const embed = document.createElement('embed');
  Object.keys(visualElement)
    .filter(
      key => visualElement[key] !== undefined && !isObject(visualElement[key]),
    )
    .forEach(key => embed.setAttribute(`data-${key}`, visualElement[key]));
  return embed.outerHTML;
};
