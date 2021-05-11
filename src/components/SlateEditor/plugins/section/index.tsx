/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Node, Element, Descendant, Editor, Text, Transforms, Range } from 'new-slate';
import { jsx } from 'new-slate-hyperscript';
import { RenderElementProps } from 'new-slate-react';
import React, { KeyboardEvent, KeyboardEventHandler } from 'react';
import { SlateSerializer } from '../../interfaces';

const TYPE_SECTION = 'section';
const KEY_BACKSPACE = 'Backspace';

export interface SectionElement {
  type: 'section';
  children: Descendant[];
}

export const sectionSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    const tag = el.tagName.toLowerCase();
    if (tag === TYPE_SECTION) {
      // Wrap single text node in section in a paragraph
      if (children.length === 1 && Text.isText(children[0])) {
        children = [jsx('element', { type: 'paragraph' }, children)];
      }
      return jsx('element', { type: TYPE_SECTION }, children);
    }
    return;
  },
  serialize(node: Descendant, children: string) {
    if (!Element.isElement(node)) return;
    if (node.type === TYPE_SECTION) {
      return `<section>${children}</section>`;
    }
  },
};

const onBackspace = (
  e: KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  nextOnKeyDown?: KeyboardEventHandler<HTMLDivElement>,
) => {
  if (editor.selection) {
    // Find the closest ancestor <section>-element
    const section = Editor.above(editor, {
      match: node => Element.isElement(node) && node.type === 'section',
      mode: 'lowest',
    })?.[0];
    if (
      Element.isElement(section) &&
      section.children.length === 1 &&
      Node.string(section).length === 0 &&
      Range.isCollapsed(editor.selection) &&
      editor.selection.anchor.offset === 0
    ) {
      if (editor.removeSection) {
        e.preventDefault();
        editor.removeSection();
        return;
      }
    }
  }
  if (nextOnKeyDown) {
    nextOnKeyDown(e);
  }
};

export const sectionPlugin = (editor: Editor) => {
  const {
    renderElement: nextRenderElement,
    normalizeNode: nextNormalizeNode,
    onKeyDown: nextOnKeyDown,
  } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === 'section') {
      return <section {...attributes}>{children}</section>;
    } else if (nextRenderElement) {
      return nextRenderElement({ attributes, children, element });
    }
    return undefined;
  };

  editor.onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === KEY_BACKSPACE) {
      onBackspace(e, editor, nextOnKeyDown);
    } else if (nextOnKeyDown) {
      nextOnKeyDown(e);
    }
  };

  editor.normalizeNode = entry => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === 'section') {
      // Insert empty paragraph if section has no children.
      if (node.children.length === 0) {
        Transforms.insertNodes(
          editor,
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
          { at: [...path, 0] },
        );
        return;
      }
      // If section contains text, wrap it in paragraph.
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Text.isText(child)) {
          Transforms.wrapNodes(
            editor,
            {
              type: 'paragraph',
              children: [],
            },
            { at: childPath },
          );
          return;
        }
      }

      // If first child is not a paragraph, insert an empty paragraph
      const firstChild = node.children[0];
      if (Element.isElement(firstChild)) {
        if (firstChild.type !== 'paragraph') {
          Transforms.insertNodes(
            editor,
            {
              type: 'paragraph',
              children: [{ text: '' }],
            },
            { at: [...path, 0] },
          );
          return;
        }
      }

      // If last child is not a paragraph, insert an empty paragraph
      const lastChild = node.children[node.children.length - 1];
      if (Element.isElement(lastChild)) {
        if (lastChild.type !== 'paragraph') {
          Transforms.insertNodes(
            editor,
            {
              type: 'paragraph',
              children: [{ text: '' }],
            },
            {
              at: [...path, node.children.length],
            },
          );
          return;
        }
      }
    }
    nextNormalizeNode(entry);
  };

  return editor;
};
