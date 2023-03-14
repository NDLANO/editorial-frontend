/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Descendant, Element } from 'slate';
import { RenderElementProps } from 'slate-react';
import SlateFigure from './SlateFigure';
import { SlateSerializer } from '../../interfaces';
import {
  LocaleType,
  Embed,
  ImageEmbed,
  H5pEmbed,
  AudioEmbed,
  BrightcoveEmbed,
  ErrorEmbed,
  ExternalEmbed,
} from '../../../../interfaces';
import { createEmbedTag, parseEmbedTag } from '../../../../util/embedTagHelpers';
import { defaultEmbedBlock, isEmbed } from './utils';
import { defaultBlockNormalizer, NormalizerConfig } from '../../utils/defaultNormalizer';
import { afterOrBeforeTextBlockElement } from '../../utils/normalizationHelpers';
import { TYPE_PARAGRAPH } from '../paragraph/types';
import {
  TYPE_EMBED_AUDIO,
  TYPE_EMBED_BRIGHTCOVE,
  TYPE_EMBED_ERROR,
  TYPE_EMBED_EXTERNAL,
  TYPE_EMBED_H5P,
  TYPE_EMBED_IMAGE,
} from './types';

export interface ImageEmbedElement {
  type: 'image-embed';
  data: ImageEmbed;
  children: Descendant[];
}

export interface H5PEmbedElement {
  type: 'h5p-embed';
  data: H5pEmbed;
  children: Descendant[];
}

export interface BrightcoveEmbedElement {
  type: 'brightcove-embed';
  data: BrightcoveEmbed;
  children: Descendant[];
}

export interface AudioEmbedElement {
  type: 'audio-embed';
  data: AudioEmbed;
  children: Descendant[];
}

export interface ErrorEmbedElement {
  type: 'error-embed';
  data: ErrorEmbed;
  children: Descendant[];
}

export interface ExternalEmbedElement {
  type: 'external-embed';
  data: ExternalEmbed;
  children: Descendant[];
}

export type EmbedElements =
  | ImageEmbedElement
  | H5PEmbedElement
  | BrightcoveEmbedElement
  | ErrorEmbedElement
  | ExternalEmbedElement
  | AudioEmbedElement;

const normalizerConfig: NormalizerConfig = {
  previous: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
  next: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
};

export const isEmbedElement = (element: Element): element is EmbedElements =>
  isEmbedType(element.type);

export const isEmbedType = (type: string) =>
  type === TYPE_EMBED_AUDIO ||
  type === TYPE_EMBED_BRIGHTCOVE ||
  type === TYPE_EMBED_H5P ||
  type === TYPE_EMBED_ERROR ||
  type === TYPE_EMBED_IMAGE ||
  type === TYPE_EMBED_EXTERNAL;

export const embedSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (!isEmbedType(el.tagName.toLowerCase())) return;
    return defaultEmbedBlock(parseEmbedTag(el.outerHTML) as Embed);
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node)) return;
    if (!isEmbed(node)) return;
    return createEmbedTag(node.data);
  },
};

export const embedPlugin = (language: string, locale?: LocaleType, disableNormalize?: boolean) => (
  editor: Editor,
) => {
  const {
    renderElement: nextRenderElement,
    normalizeNode: nextNormalizeNode,
    isVoid: nextIsVoid,
  } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (isEmbedElement(element)) {
      return (
        <SlateFigure
          attributes={attributes}
          editor={editor}
          element={element}
          language={language}
          locale={locale}>
          {children}
        </SlateFigure>
      );
    } else if (nextRenderElement) {
      return nextRenderElement({ attributes, children, element });
    }
    return undefined;
  };

  editor.normalizeNode = entry => {
    const [node] = entry;

    if (isEmbed(node)) {
      if (!disableNormalize && defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return;
      }
    }
    nextNormalizeNode(entry);
  };

  editor.isVoid = (element: Element) => {
    if (isEmbedElement(element)) {
      return true;
    }
    return nextIsVoid(element);
  };

  return editor;
};
