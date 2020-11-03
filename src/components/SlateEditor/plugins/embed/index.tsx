/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Block, Document, Editor, Inline } from 'slate';
import SlateFigure from './SlateFigure';
import defaultBlocks from '../../utils/defaultBlocks';
import { SlateEditor, SlateFigureProps } from '../../../../interfaces';

type ParentNode = Document | Block | Inline;

export default function createEmbedPlugin(language: string, locale: string) {
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
        normalize: (
          editor: SlateEditor,
          error: { code: string; child: any },
        ) => {
          switch (error.code) {
            case 'next_sibling_type_invalid': {
              editor.withoutSaving(() => {
                editor
                  .moveToEndOfNode(error.child)
                  .insertBlock(defaultBlocks.defaultBlock);
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
  ) => {
    const { node } = props;
    switch ((node as ParentNode)?.type) {
      case 'embed':
        return (
          <SlateFigure
            attributes={props.attributes}
            editor={props.editor}
            isSelected={props.isSelected}
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
}
