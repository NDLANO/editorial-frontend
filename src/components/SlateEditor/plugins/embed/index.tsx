/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactElement } from 'react';
import { Editor, Descendant, Element } from 'slate';
import { RenderElementProps } from 'slate-react';
import SlateFigure from './SlateFigure';
import { SlateSerializer } from '../../interfaces';
import { LocaleType, SlateFigureProps, Embed } from '../../../../interfaces';
import { createEmbedTag, parseEmbedTag } from '../../../../util/embedTagHelpers';
import { defaultEmbedBlock } from './utils';

export const TYPE_EMBED = 'embed';

export interface EmbedElement {
  type: 'embed';
  data: any;
  children: Descendant[];
}

export const embedSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_EMBED) return;
    return defaultEmbedBlock((parseEmbedTag(el.outerHTML) as unknown) as Embed);
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node)) return;
    if (node.type !== TYPE_EMBED) return;
    return createEmbedTag(node.data);
  },
};

export const embedPlugin = (language: string, locale: LocaleType) => (editor: Editor) => {
  const {
    renderElement: nextRenderElement,
    normalizeNode: nextNormalizeNode,
    isVoid: nextIsVoid,
  } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === TYPE_EMBED) {
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
  return editor;
};

export const createEmbedPlugin = (language: string, locale: LocaleType) => {
  const schema = {
    blocks: {
      embed: {
        isVoid: true,
        data: {},
        next: [
          {
            type: 'paragraph',
          },
          { type: 'heading-two' },
          { type: 'heading-three' },
        ],
        normalize: (editor: Editor, error: SlateError) => {
          switch (error.code) {
            case 'next_sibling_type_invalid': {
              editor.withoutSaving(() => {
                editor.moveToEndOfNode(error.child).insertBlock(defaultBlocks.defaultBlock);
              });
              break;
            }
            default:
              break;
          }
        },
      },
    },
  };

  const renderBlock = (
    props: SlateFigureProps,
    editor: Editor,
    next: () => void,
  ): ReactElement | void => {
    const { attributes, isSelected, node } = props;
    switch ((node as ParentNode)?.type) {
      case 'embed':
        return (
          <SlateFigure
            attributes={attributes}
            editor={props.editor}
            isSelected={isSelected}
            language={language}
            node={node}
            locale={locale}
          />
        );
      default:
        return next();
    }
  };

  return {
    schema,
    renderBlock,
  };
};

export default createEmbedPlugin;
