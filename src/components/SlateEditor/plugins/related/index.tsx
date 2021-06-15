/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Descendant, Editor, Element } from 'slate';
import RelatedArticleBox from './RelatedArticleBox';
import defaultBlocks from '../../utils/defaultBlocks';
import { SlateSerializer } from '../../interfaces';
import { jsx } from 'slate-hyperscript';
import { createEmbedTag, reduceChildElements } from '../../../../util/embedTagHelpers';
import { RenderElementProps } from 'slate-react';

export const TYPE_RELATED = 'related';

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
    if (type !== 'related') return;

    return jsx(
      'element',
      {
        type: TYPE_RELATED,
        data: reduceChildElements(el, TYPE_RELATED),
      },
      { text: '' },
    );
  },
  serialize(node: Descendant, children: string) {
    if (!Element.isElement(node) || node.type !== TYPE_RELATED) return;

    return `<div data-type="related-content">${node.data.nodes &&
      node.data.nodes.map(child => {
        return createEmbedTag(child);
      })}</div>`;
  },
};

export const relatedPlugin = (editor: Editor) => {
  const { renderElement, isVoid } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === 'related') {
      return (
        <RelatedArticleBox attributes={attributes} element={element}>
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

  return Editor;
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
