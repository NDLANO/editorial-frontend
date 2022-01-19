/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Node, Element, Descendant, Text, Path, Transforms } from 'slate';
import { RenderElementProps } from 'slate-react';
import { jsx as slatejsx } from 'slate-hyperscript';
import { SlateSerializer } from '../../interfaces';
import { reduceElementDataAttributes } from '../../../../util/embedTagHelpers';
import { TYPE_BREAK } from '../break';
import { getCurrentParagraph, isParagraph, TYPE_PARAGRAPH } from './utils';
import containsVoid from '../../utils/containsVoid';
import { TYPE_LIST_ITEM } from '../list/types';
import { BlockPickerOptions } from '../blockPicker/options';
import Paragraph from './Paragraph';
import { TYPE_TABLE_CELL } from '../table/utils';
import { KEY_ENTER } from '../../utils/keys';

export interface ParagraphElement {
  type: 'paragraph';
  data?: {
    align?: string;
  };
  serializeAsText?: boolean;
  children: Descendant[];
}

const onEnter = (
  e: KeyboardEvent,
  editor: Editor,
  nextOnKeyDown?: (event: KeyboardEvent) => void,
) => {
  const currentParagraph = getCurrentParagraph(editor);

  if (!currentParagraph) {
    if (nextOnKeyDown) {
      return nextOnKeyDown(e);
    }
    return;
  }
  e.preventDefault();
  /**
   If the user types enter in an empty paragraph we transform the paragraph to a <br>.
   This enables us to filter out unnecessary empty <p> tags on save. We insert empty p tags
   throughout the document to enable positioning the cursor between element with no
   spacing (i.e two images).
   */
  if (Node.string(currentParagraph) === '' && !containsVoid(editor, currentParagraph)) {
    editor.insertNode({
      type: TYPE_BREAK,
      children: [{ text: '' }],
    });

    editor.insertNode({
      type: TYPE_PARAGRAPH,
      children: [{ text: '' }],
    });
    return;
  }

  if (e.shiftKey === true) {
    return editor.insertText('\n');
  }

  return editor.insertNode({
    type: TYPE_PARAGRAPH,
    children: [{ text: '' }],
  });
};

export const paragraphSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== 'p') return;

    const data = reduceElementDataAttributes(el, ['align', 'data-align']);

    return slatejsx(
      'element',
      {
        type: TYPE_PARAGRAPH,
        ...(Object.keys(data).length > 0 ? { data } : {}),
      },
      children,
    );
  },
  serialize(node: Descendant, children: JSX.Element[]) {
    if (!Element.isElement(node)) return;
    if (node.type !== TYPE_PARAGRAPH) return;

    /**
      We insert empty p tag throughout the document to enable positioning the cursor
      between element with no spacing (i.e two images). We need to remove these element
      on seriaization.
     */

    if (Node.string(node) === '' && node.children.length === 1 && Text.isText(node.children[0]))
      return null;

    if (node.serializeAsText) {
      return <>{children}</>;
    }

    const attributes = node.data?.align ? { 'data-align': node.data.align } : {};
    return <p {...attributes}>{children}</p>;
  },
};

export const paragraphPlugin = (language?: string, blockpickerOptions?: BlockPickerOptions) => (
  editor: Editor,
) => {
  const { onKeyDown, renderElement, normalizeNode } = editor;

  editor.onKeyDown = (e: KeyboardEvent) => {
    if (e.key === KEY_ENTER) {
      onEnter(e, editor, onKeyDown);
    } else if (onKeyDown) {
      onKeyDown(e);
    }
  };

  editor.normalizeNode = entry => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === TYPE_PARAGRAPH) {
      const [parentNode] = Editor.node(editor, Path.parent(path));

      // If paragraph is not in a list or table, make sure it will be rendered with <p>-tag
      if (
        Element.isElement(parentNode) &&
        parentNode.type !== TYPE_TABLE_CELL &&
        parentNode.type !== TYPE_LIST_ITEM &&
        node.serializeAsText
      ) {
        return Transforms.unsetNodes(editor, 'serializeAsText', { at: path });
      }

      // If two paragraphs are direct siblings, make sure both will be rendered with <p>-tag
      if (Path.hasPrevious(path)) {
        const [previousNode] = Editor.node(editor, Path.previous(path));
        if (isParagraph(previousNode) && (previousNode.serializeAsText || node.serializeAsText)) {
          return Transforms.unsetNodes(editor, 'serializeAsText', {
            at: Path.parent(path),
            mode: 'all',
            match: isParagraph,
          });
        }
      }
      if (Editor.hasPath(editor, Path.next(path))) {
        const [nextNode] = Editor.node(editor, Path.next(path));
        if (isParagraph(nextNode) && (nextNode.serializeAsText || node.serializeAsText)) {
          return Transforms.unsetNodes(editor, 'serializeAsText', {
            at: Path.parent(path),
            mode: 'all',
            match: isParagraph,
          });
        }
      }
    }

    // Unwrap block element children. Only text allowed.
    if (Element.isElement(node) && node.type === TYPE_PARAGRAPH) {
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Element.isElement(child) && !editor.isInline(child)) {
          Transforms.unwrapNodes(editor, { at: childPath });
          return;
        }
      }
    }

    normalizeNode(entry);
  };

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === TYPE_PARAGRAPH) {
      return (
        <Paragraph
          attributes={attributes}
          element={element}
          editor={editor}
          language={language}
          blockpickerOptions={blockpickerOptions}>
          {children}
        </Paragraph>
      );
    } else if (renderElement) {
      return renderElement({ attributes, children, element });
    }
    return undefined;
  };

  return editor;
};
