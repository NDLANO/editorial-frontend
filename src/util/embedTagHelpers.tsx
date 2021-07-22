/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
import { Dictionary } from 'lodash';
import isObject from 'lodash/fp/isObject';
import { isEmpty } from '../components/validators';
import { Embed } from '../interfaces';

export const removeEmptyElementDataAttributes = (obj: Dictionary<any>) => {
  const newObject: Dictionary<string> = {};
  Object.keys(obj).forEach((key: string) => {
    if (obj[key] !== null && obj[key] !== undefined) {
      newObject[key] = obj[key];
    }
  });
  return newObject;
};

export const reduceElementDataAttributes = (
  el: HTMLElement,
  filter?: string[],
): { [key: string]: string } => {
  if (!el.attributes) return {};
  let attrs: Attr[] = [].slice.call(el.attributes);
  attrs = attrs.filter(a => a.name !== 'style');

  if (filter) attrs = attrs.filter(a => filter.includes(a.name));
  const obj = attrs.reduce(
    (all, attr) => Object.assign({}, all, { [attr.name.replace('data-', '')]: attr.value }),
    {},
  );
  return obj;
};

export const reduceChildElements = (el: HTMLElement, type: string) => {
  const childs: object[] = [];
  el.childNodes.forEach(node => {
    const childElement = node as HTMLElement;
    if (type === 'file') {
      childs.push({
        ...childElement.dataset,
      });
    } else if (type === 'related-content') {
      if (childElement.dataset) {
        const convertedDataset = Object.keys(childElement.dataset).reduce((acc, curr) => {
          const currValue = childElement.dataset[curr];
          if (curr === 'articleId')
            return {
              ...acc,
              'article-id': currValue,
            };
          return {
            ...acc,
            [curr]: currValue,
          };
        }, {});
        childs.push(convertedDataset);
      }
    } else {
      childs.push(childElement.dataset);
    }
  });

  return { nodes: childs };
};

export const createDataProps = (obj: Dictionary<string>) =>
  Object.keys(obj)
    .filter(key => obj[key] !== undefined && !isObject(obj[key]))
    .reduce((acc, key) => ({ ...acc, [`data-${key}`]: obj[key] }), {});

export const createProps = (obj: Dictionary<string>) =>
  Object.keys(obj)
    .filter(key => obj[key] !== undefined && !isObject(obj[key]))
    .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});

export const parseEmbedTag = (embedTag: string) => {
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
  return (obj as unknown) as Embed;
};

export const createEmbedTag = (data: { [key: string]: any }) => {
  if (Object.keys(data).length === 0) {
    return undefined;
  }
  const props: Dictionary<string> = {};
  Object.keys(data)
    .filter(key => data[key] !== undefined && !isObject(data[key]))
    .forEach(key => (props[`data-${key}`] = data[key]));

  return <embed {...props}></embed>;
};

export const isUserProvidedEmbedDataValid = (embed: Embed) => {
  if (embed.resource === 'image') {
    return !isEmpty(embed.alt);
  }
  return true;
};
