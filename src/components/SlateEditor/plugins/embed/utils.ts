/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from 'slate-hyperscript';
import { Element, Node } from 'slate';
import { Embed } from '../../../../interfaces';
import {
  TYPE_EMBED_BRIGHTCOVE,
  TYPE_EMBED_ERROR,
  TYPE_EMBED_EXTERNAL,
  TYPE_EMBED_IMAGE,
} from './types';
import {
  BrightcoveEmbedElement,
  EmbedElements,
  ErrorEmbedElement,
  ExternalEmbedElement,
  ImageEmbedElement,
} from '.';

export const defaultEmbedBlock = (data: Partial<Embed>) =>
  slatejsx('element', { type: defineTypeOfEmbed(data?.resource), data }, { text: '' });

export const isSlateEmbed = (
  node: Node,
): node is
  | ImageEmbedElement
  | ErrorEmbedElement
  | ExternalEmbedElement
  | BrightcoveEmbedElement => {
  return (
    Element.isElement(node) &&
    (node.type === TYPE_EMBED_BRIGHTCOVE ||
      node.type === TYPE_EMBED_ERROR ||
      node.type === TYPE_EMBED_EXTERNAL ||
      node.type === TYPE_EMBED_IMAGE)
  );
};

export const defineTypeOfEmbed = (type?: string) => {
  if (type === 'video' || type === 'brightcove') {
    return TYPE_EMBED_BRIGHTCOVE;
  } else if (type === 'external' || type === 'iframe') {
    return TYPE_EMBED_EXTERNAL;
  } else if (type === 'image') {
    return TYPE_EMBED_IMAGE;
  } else if (type === undefined) {
    return TYPE_EMBED_ERROR;
  }
  return type;
};

export const isSlateEmbedElement = (element: Element): element is EmbedElements =>
  isEmbedType(element.type);

export const isEmbedType = (type: string) =>
  type === TYPE_EMBED_BRIGHTCOVE ||
  type === TYPE_EMBED_ERROR ||
  type === TYPE_EMBED_IMAGE ||
  type === TYPE_EMBED_EXTERNAL;
