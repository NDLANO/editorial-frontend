/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactElement } from 'react';
import { Block, Document, Editor, Inline, SlateError } from 'slate';
import SlateFigure from './SlateFigure';
import defaultBlocks from '../../utils/defaultBlocks';
import { SlateFigureProps } from '../../../../interfaces';

type ParentNode = Document | Block | Inline;

export const createEmbedPlugin = (language: string, locale: string) => {
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
