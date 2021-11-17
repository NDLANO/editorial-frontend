/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dictionary } from 'lodash';
import { Descendant, Node, Element } from 'slate';
import { TYPE_PARAGRAPH } from './SlateEditor/plugins/paragraph/utils';
import { TYPE_SECTION } from './SlateEditor/plugins/section';

const rUrl = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i; //eslint-disable-line

export const getLength = (value?: Descendant[] | Descendant | string | null) => {
  if (!value) {
    return 0;
  }
  if (Node.isNodeList(value)) {
    return value.map(Node.string).join().length;
  } else if (Node.isNode(value)) {
    return Node.string(value).length;
  }
  return value.length;
};

export const isEmpty = (value?: Descendant[] | Descendant | string | null) => {
  if (!value) {
    return true;
  }

  if (Node.isNodeList(value)) {
    for (const node of value) {
      // If one root node is not paragraph or section
      if (Element.isElement(node) && ![TYPE_PARAGRAPH, TYPE_SECTION].includes(node.type)) {
        return false;
      }
      // If one descendant of root is not paragraph
      for (const el of [...Node.elements(node)]) {
        const [element] = el;
        if (Element.isElement(element) && element.type !== TYPE_PARAGRAPH) {
          return false;
        }
      }
    }

    return value.length === 0 || (value.length === 1 && Node.string(value[0]).length === 0);
  } else if (Node.isNode(value)) {
    for (const el of [...Node.elements(value)]) {
      const [element] = el;
      if (Element.isElement(element) && element.type !== TYPE_PARAGRAPH) {
        return false;
      }
    }
    return Node.string(value).length === 0;
  } else if (value.constructor === Object) {
    if (Object.keys(value).length === 0) {
      return true;
    }
  }
  if (value.length === 0) {
    return true;
  }
  return false;
};

export const isUrl = (value: string) => {
  if (!isEmpty(value)) {
    return rUrl.test(value);
  }
  return false;
};

export const validDateRange = (before: string | number | Date, after: string | number | Date) => {
  const beforeDate = new Date(before);
  const afterDate = new Date(after);
  return beforeDate.getTime() <= afterDate.getTime();
};

export const minLength = (value: Descendant[] | Descendant | string | null, length: number) =>
  getLength(value) < length;
export const maxLength = (value: Descendant[] | Descendant | string | null, length: number) =>
  getLength(value) > length;

export const minItems = (value: Descendant[] | Descendant | string, number: number) =>
  !value || (Array.isArray(value) && value.length < number);

//  https://stackoverflow.com/a/1830844
export const isNumeric = (value: any) => !Number.isNaN(value - parseFloat(value));

export const objectHasBothField = (obj: Dictionary<any>) =>
  Object.keys(obj).filter(key => isEmpty(obj[key])).length === 0;
