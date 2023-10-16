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
  Embed,
  ImageEmbed,
  BrightcoveEmbed,
  ErrorEmbed,
  ExternalEmbed,
} from '../../../../interfaces';
import { createEmbedTag, parseEmbedTag } from '../../../../util/embedTagHelpers';
import { defaultEmbedBlock, isSlateEmbed, isSlateEmbedElement } from './utils';
import { defaultBlockNormalizer, NormalizerConfig } from '../../utils/defaultNormalizer';
import { afterOrBeforeTextBlockElement } from '../../utils/normalizationHelpers';
import { TYPE_PARAGRAPH } from '../paragraph/types';
import { TYPE_NDLA_EMBED } from './types';
import { AudioElement } from '../audio/types';
import { H5pElement } from '../h5p/types';

export interface ImageEmbedElement {
  type: 'image-embed';
  data: ImageEmbed;
  children: Descendant[];
}

export interface BrightcoveEmbedElement {
  type: 'brightcove-embed';
  data: BrightcoveEmbed;
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
  | H5pElement
  | BrightcoveEmbedElement
  | ErrorEmbedElement
  | ExternalEmbedElement
  | AudioElement;

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

export const embedSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    return defaultEmbedBlock(parseEmbedTag(el.outerHTML) as Embed);
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node) || !isSlateEmbed(node)) return;
    return createEmbedTag(node.data);
  },
};

export const embedPlugin =
  (language: string, disableNormalize?: boolean, allowDecorative?: boolean) => (editor: Editor) => {
    const {
      renderElement: nextRenderElement,
      normalizeNode: nextNormalizeNode,
      isVoid: nextIsVoid,
    } = editor;

    editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
      if (isSlateEmbedElement(element)) {
        return (
          <SlateFigure
            attributes={attributes}
            editor={editor}
            element={element}
            language={language}
            allowDecorative={allowDecorative}
          >
            {children}
          </SlateFigure>
        );
      } else if (nextRenderElement) {
        return nextRenderElement({ attributes, children, element });
      }
      return undefined;
    };

    editor.normalizeNode = (entry) => {
      const [node] = entry;

      if (isSlateEmbed(node)) {
        if (!disableNormalize && defaultBlockNormalizer(editor, entry, normalizerConfig)) {
          return;
        }
        return undefined;
      }

      nextNormalizeNode(entry);
    };

    editor.isVoid = (element: Element) => {
      if (isSlateEmbedElement(element)) {
        return true;
      }
      return nextIsVoid(element);
    };

    return editor;
  };
