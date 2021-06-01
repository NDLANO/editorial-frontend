/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactElement } from 'react';
import { Element, Descendant, Editor } from 'slate';
import { RenderElementProps } from 'slate-react';
import { jsx } from 'slate-hyperscript';
import DetailsBox from './DetailsBox';
import { defaultBlocks } from '../../utils';
import onKeyDown from './onKeyDown';
import { defaultTextBlockNormalizer } from '../../utils/normalizationHelpers';
import { SlateSerializer } from '../../interfaces';

export const TYPE_DETAILS = 'details';
export const TYPE_SUMMARY = 'summary';

export interface DetailsElement {
  type: 'details';
  children: Descendant[];
}

export interface SummaryElement {
  type: 'summary';
  children: Descendant[];
}

export const detailsSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    if (el.tagName.toLowerCase() === 'summary') {
      return jsx('element', { type: TYPE_SUMMARY }, children);
    } else if (el.tagName.toLowerCase() === 'details') {
      return jsx('element', { type: TYPE_DETAILS }, children);
    }
    return;
  },
  serialize(node: Descendant, children: string) {
    if (!Element.isElement(node)) return;
    if (node.type === TYPE_SUMMARY) {
      return `<summary>${children}</summary>`;
    } else if (node.type === TYPE_DETAILS) {
      return `<details>${children}</details>`;
    }
  },
};

export const detailsPlugin = (editor: Editor) => {
  const { renderElement: nextRenderElement, normalizeNode: nextNormalizeNode } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === TYPE_SUMMARY) {
      return <span {...attributes}>{children}</span>;
    } else if (element.type === TYPE_DETAILS) {
      return (
        <DetailsBox attributes={attributes} children={children} editor={editor} element={element} />
      );
    } else if (nextRenderElement) {
      return nextRenderElement({ attributes, children, element });
    }
    return undefined;
  };
  editor.normalizeNode = entry => {
    const [node] = entry;

    if (Element.isElement(node)) {
      if (node.type === TYPE_DETAILS) {
        return;
      }
      if (node.type === TYPE_SUMMARY) {
        return;
      }
    }
    nextNormalizeNode(entry);
  };
  return editor;
};

// type ParentNode = Document | Block | Inline | null;
// enum NodeType {
//   object = 'text',
// }

// interface Props {
//   attributes: {
//     'data-key': string;
//     'data-slate-object': string;
//   };
//   children: ReactElement[];
//   node: Node;
// }

// export const summaryBlock = {
//   type: 'summary',
//   data: {},
//   nodes: [
//     {
//       object: NodeType.object,
//       text: '',
//       marks: [],
//     },
//   ],
// };

// export const defaultDetailsBlock = () =>
//   Block.create({
//     type: 'details',
//     nodes: Block.createList([summaryBlock, defaultBlocks.defaultBlock]),
//   });

// export const createDetails = () => {
//   const schema = {
//     blocks: {
//       summary: {
//         isVoid: false,
//         nodes: [
//           {
//             match: [{ object: 'text' }],
//             min: 1,
//           },
//         ],
//         next: { type: 'paragraph' },
//         parent: { type: 'details' },
//         normalize: (editor: Editor, error: SlateError) => {
//           switch (error.code) {
//             case 'parent_type_invalid': {
//               // Pakker ut en summary som havner utenfor details og wrapper i en paragraph
//               const summary = error.node.text;
//               editor.withoutSaving(() => {
//                 editor.wrapBlockByKey(error.node.key, 'paragraph');
//                 const parent = editor.value.document.getParent(error.node.key);
//                 if (parent === null) return;
//                 const text = Text.create({
//                   object: 'text',
//                   text: summary,
//                   marks: [],
//                 });
//                 editor.insertNodeByKey(parent.key, 0, text);
//               });
//               break;
//             }
//             case 'next_sibling_type_invalid': {
//               editor.withoutSaving(() => {
//                 editor.wrapBlockByKey(error.child.key, 'section');
//                 const wrapper = editor.value.document.getParent(error.child.key);
//                 if (wrapper === null) return;
//                 editor.insertNodeByKey(wrapper.key, 1, Block.create(defaultBlocks.defaultBlock));
//                 editor.unwrapBlockByKey(wrapper.key, 'section');
//               });
//               break;
//             }
//             default:
//               break;
//           }
//         },
//       },
//       details: {
//         isVoid: false,
//         nodes: [
//           {
//             match: { type: 'summary' },
//             min: 1,
//             max: 1,
//           },
//           {
//             match: [
//               { type: 'paragraph' },
//               { type: 'heading-two' },
//               { type: 'heading-three' },
//               { type: 'bulleted-list' },
//               { type: 'letter-list' },
//               { type: 'numbered-list' },
//               { type: 'quote' },
//               { type: 'table' },
//               { type: 'embed' },
//               { type: 'file' },
//               { type: 'code-block' },
//             ],
//           },
//         ],
//         first: { type: 'summary' },
//         last: { type: 'paragraph' },
//         next: [
//           {
//             type: 'paragraph',
//           },
//           { type: 'heading-two' },
//           { type: 'heading-three' },
//         ],
//         normalize: (editor: Editor, error: SlateError) => {
//           switch (error.code) {
//             case 'first_child_type_invalid': {
//               const block = Block.create(summaryBlock);
//               editor.withoutSaving(() => {
//                 editor.insertNodeByKey(error.node.key, 0, block);
//               });
//               break;
//             }
//             case 'last_child_type_invalid': {
//               const block = Block.create(defaultBlocks.defaultBlock);
//               editor.withoutSaving(() => {
//                 editor.insertNodeByKey(error.node.key, error.node.nodes.size, block);
//               });
//               break;
//             }
//             case 'next_sibling_type_invalid': {
//               editor.withoutSaving(() => {
//                 editor.wrapBlockByKey(error.child.key, 'section');
//                 const wrapper = editor.value.document.getParent(error.child.key);
//                 if (wrapper === null) return;
//                 editor.insertNodeByKey(wrapper?.key, 1, Block.create(defaultBlocks.defaultBlock));
//                 editor.unwrapBlockByKey(wrapper.key, 'section');
//               });
//               break;
//             }
//             case 'child_type_invalid': {
//               // Unwrap until valid node.
//               editor.withoutSaving(() => {
//                 editor.unwrapBlockByKey(error.child.key, error.child.type);
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

//   const renderBlock = (props: Props, editor: Editor, next: () => void): ReactElement | void => {
//     const { attributes, children, node } = props;
//     switch ((node as ParentNode)?.type) {
//       case 'details':
//         return (
//           <DetailsBox attributes={attributes} children={children} editor={editor} node={node} />
//         );
//       case 'summary':
//         return <span {...attributes}>{node.text}</span>;
//       default:
//         return next();
//     }
//   };

//   return {
//     schema,
//     renderBlock,
//     onKeyDown,
//   };
// };

// export default createDetails;
