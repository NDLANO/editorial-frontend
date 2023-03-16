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
  TYPE_EMBED_AUDIO,
  TYPE_EMBED_BRIGHTCOVE,
  TYPE_EMBED_ERROR,
  TYPE_EMBED_EXTERNAL,
  TYPE_EMBED_H5P,
  TYPE_EMBED_IMAGE,
} from './types';
import {
  AudioEmbedElement,
  BrightcoveEmbedElement,
  ErrorEmbedElement,
  ExternalEmbedElement,
  H5PEmbedElement,
  ImageEmbedElement,
} from '.';

export const defaultEmbedBlock = (data: Partial<Embed>) => {
  return slatejsx('element', { type: defineEmbed(data?.resource), data }, { text: '' });
};

export const isSlateEmbed = (
  node: Node,
): node is
  | H5PEmbedElement
  | ImageEmbedElement
  | AudioEmbedElement
  | ErrorEmbedElement
  | ExternalEmbedElement
  | BrightcoveEmbedElement => {
  return (
    Element.isElement(node) &&
    (node.type === TYPE_EMBED_AUDIO ||
      node.type === TYPE_EMBED_BRIGHTCOVE ||
      node.type === TYPE_EMBED_ERROR ||
      node.type === TYPE_EMBED_EXTERNAL ||
      node.type === TYPE_EMBED_H5P ||
      node.type === TYPE_EMBED_IMAGE)
  );
};

export const defineEmbed = (type?: string) => {
  if (type === 'audio') {
    return TYPE_EMBED_AUDIO;
  } else if (type === 'video' || type === 'brightcove') {
    return TYPE_EMBED_BRIGHTCOVE;
  } else if (type === 'external') {
    return TYPE_EMBED_EXTERNAL;
  } else if (type === 'h5p') {
    return TYPE_EMBED_H5P;
  } else if (type === 'image') {
    return TYPE_EMBED_IMAGE;
  } else if (type === undefined) {
    return TYPE_EMBED_ERROR;
  }
  return type;
};
