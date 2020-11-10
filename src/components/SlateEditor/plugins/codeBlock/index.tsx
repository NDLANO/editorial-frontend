/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Block, Document, Inline } from 'slate';
import CodeBlock from './CodeBlock';
import defaultBlocks from '../../utils/defaultBlocks';
import { SlateEditor, CodeBlockProps } from '../../../../interfaces';

type ParentNode = Document | Block | Inline;

export const TYPE = 'code-block';

export default () => {
  const schema = {
    blocks: {
      'code-block': {
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
    props: CodeBlockProps,
    editor: SlateEditor,
    next: () => void,
  ) => {
    const { node } = props;
    switch ((node as ParentNode)?.type) {
      case TYPE:
        return (
          <CodeBlock
            attributes={props.attributes}
            editor={props.editor}
            node={node}
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
