/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Descendant, Editor, Element, Path, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { jsx } from 'slate-hyperscript';
import RelatedArticleBox from './RelatedArticleBox';
import { SlateSerializer } from '../../interfaces';
import { createEmbedTag, reduceChildElements } from '../../../../util/embedTagHelpers';
import { afterOrBeforeTextBlockElement } from '../../utils/normalizationHelpers';
import { defaultParagraphBlock } from '../paragraph/utils';

export const TYPE_RELATED = 'related';

export const defaultRelatedBlock = () => {
  return jsx('element', { type: TYPE_RELATED, data: {} }, { text: '' });
};

export interface RelatedElement {
  type: 'related';
  data: {
    nodes: object[];
  };
  children: Descendant[];
}

export const relatedSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    if (el.tagName.toLowerCase() !== 'div') return;
    const { type } = el.dataset;
    if (type !== 'related-content') return;

    return jsx(
      'element',
      {
        type: TYPE_RELATED,
        data: reduceChildElements(el, type),
      },
      { text: '' },
    );
  },
  serialize(node: Descendant, children: string) {
    if (!Element.isElement(node) || node.type !== TYPE_RELATED) return;

    return `<div data-type="related-content">${
      node.data.nodes
        ? node.data.nodes
            .map(child => {
              return createEmbedTag(child);
            })
            .join('')
        : ''
    }</div>`;
  },
};

export const relatedPlugin = (editor: Editor) => {
  const { renderElement, isVoid, normalizeNode } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === 'related') {
      return (
        <RelatedArticleBox
          attributes={attributes}
          element={element}
          editor={editor}
          onRemoveClick={(e: Event) => {
            e.stopPropagation();
            e.preventDefault();
            const path = ReactEditor.findPath(editor, element);
            ReactEditor.focus(editor);
            Transforms.select(editor, path);
            Transforms.removeNodes(editor, { at: path });
          }}>
          {children}
        </RelatedArticleBox>
      );
    }
    return renderElement && renderElement({ attributes, children, element });
  };

  editor.isVoid = element => {
    if (element.type === 'related') {
      return true;
    }
    return isVoid(element);
  };

  editor.normalizeNode = entry => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === TYPE_RELATED) {
      const nextPath = Path.next(path);

      if (Editor.hasPath(editor, nextPath)) {
        const [nextNode] = Editor.node(editor, nextPath);
        if (
          !Element.isElement(nextNode) ||
          !afterOrBeforeTextBlockElement.includes(nextNode.type)
        ) {
          Transforms.insertNodes(editor, defaultParagraphBlock(), {
            at: nextPath,
          });

          return;
        }
      }

      if (Path.hasPrevious(path)) {
        const previousPath = Path.previous(path);

        if (Editor.hasPath(editor, previousPath)) {
          const [previousNode] = Editor.node(editor, previousPath);
          if (
            !Element.isElement(previousNode) ||
            !afterOrBeforeTextBlockElement.includes(previousNode.type)
          ) {
            Transforms.insertNodes(editor, defaultParagraphBlock(), {
              at: path,
            });

            return;
          }
        }
      }
    }
    normalizeNode(entry);
  };

  return editor;
};

// export default function relatedPlugin() {
//   const schema = {
//     document: {},
//     blocks: {
//       related: {
//         isVoid: true,
//         data: {},
//         next: [
//           {
//             type: 'paragraph',
//           },
//           { type: 'heading-two' },
//           { type: 'heading-three' },
//         ],
//         normalize: (editor, error) => {
//           switch (error.code) {
//             case 'next_sibling_type_invalid': {
//               editor.withoutSaving(() => {
//                 editor.moveToEndOfNode(error.child).insertBlock(defaultBlocks.defaultBlock);
//               });
//               break;
//             }
//             default:
//               break;
//           }
//         },
//       },
//     },
//   };

//   /* eslint-disable react/prop-types */
//   const renderBlock = (props, editor, next) => {
//     const { node } = props;

//     const onRemoveClick = e => {
//       e.stopPropagation();
//       editor.removeNodeByKey(node.key);
//       editor.focus();
//     };

//     switch (node.type) {
//       case 'related':
//         return <RelatedArticleBox onRemoveClick={onRemoveClick} {...props} />;
//       default:
//         return next();
//     }
//   };

//   return {
//     schema,
//     renderBlock,
//   };
// }
