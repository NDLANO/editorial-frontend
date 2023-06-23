/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createElement } from 'react';
import { RenderElementProps } from 'slate-react';
import { jsx as slatejsx } from 'slate-hyperscript';
import { Descendant, Editor, Element, Transforms, Range, Node, Path } from 'slate';
import { SlateSerializer } from '../../interfaces';
import hasNodeOfType from '../../utils/hasNodeOfType';
import { KEY_BACKSPACE, KEY_ENTER } from '../../utils/keys';
import { TYPE_PARAGRAPH } from '../paragraph/types';
import { TYPE_HEADING } from './types';

export interface HeadingElement {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: Descendant[];
}

export const headingSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'h1') {
      return slatejsx('element', { type: TYPE_HEADING, level: 2 }, children);
    }
    if (tag === 'h2') {
      return slatejsx('element', { type: TYPE_HEADING, level: 2 }, children);
    }
    if (tag === 'h3') {
      return slatejsx('element', { type: TYPE_HEADING, level: 3 }, children);
    }
    if (tag === 'h4') {
      return slatejsx('element', { type: TYPE_HEADING, level: 4 }, children);
    }
    if (tag === 'h5') {
      return slatejsx('element', { type: TYPE_HEADING, level: 4 }, children);
    }
    if (tag === 'h6') {
      return slatejsx('element', { type: TYPE_HEADING, level: 4 }, children);
    }
  },
  serialize(node: Descendant, children: JSX.Element[]) {
    if (!Element.isElement(node)) return;
    if (node.type === TYPE_HEADING) {
      return createElement('h' + node.level, [], [children]);
    }
  },
};

const onEnter = (
  e: KeyboardEvent,
  editor: Editor,
  nextOnKeyDown?: (event: KeyboardEvent) => void,
) => {
  if (hasNodeOfType(editor, TYPE_HEADING)) {
    e.preventDefault();
    Transforms.insertNodes(editor, slatejsx('element', { type: TYPE_PARAGRAPH }, [{ text: '' }]));
    return;
  }
  return nextOnKeyDown && nextOnKeyDown(e);
};

const onBackspace = (
  e: KeyboardEvent,
  editor: Editor,
  nextOnKeyDown?: (event: KeyboardEvent) => void,
) => {
  if (hasNodeOfType(editor, TYPE_HEADING)) {
    if (Range.isRange(editor.selection)) {
      if (e.ctrlKey) {
        e.preventDefault();
        editor.deleteBackward('word');
        // Replace heading with paragraph if last character is removed
        if (
          hasNodeOfType(editor, 'heading') &&
          Editor.string(editor, editor.selection.anchor.path) === ''
        ) {
          Transforms.unwrapNodes(editor, {
            match: (node) => Element.isElement(node) && node.type === 'heading',
          });
          return;
        }
      }
      // Replace heading with paragraph if last character is removed
      if (
        Range.isCollapsed(editor.selection) &&
        Editor.string(editor, editor.selection.anchor.path).length === 1 &&
        editor.selection.anchor.offset === 1
      ) {
        e.preventDefault();
        editor.deleteBackward('character');
        Transforms.unwrapNodes(editor, {
          match: (node) => Element.isElement(node) && node.type === TYPE_HEADING,
        });
        return;
      }
    }
  }
  return nextOnKeyDown && nextOnKeyDown(e);
};

export const headingPlugin = (editor: Editor) => {
  const {
    renderElement: nextRenderElement,
    normalizeNode: nextNormalizeNode,
    onKeyDown: nextOnKeyDown,
  } = editor;

  editor.renderElement = (props: RenderElementProps) => {
    const { element, attributes, children } = props;
    if (element.type === TYPE_HEADING) {
      switch (element.level) {
        case 1:
          return <h1 {...attributes}>{children}</h1>;
        case 2:
          return <h2 {...attributes}>{children}</h2>;
        case 3:
          return <h3 {...attributes}>{children}</h3>;
        case 4:
          return <h4 {...attributes}>{children}</h4>;
        case 5:
          return <h5 {...attributes}>{children}</h5>;
        case 6:
          return <h6 {...attributes}>{children}</h6>;
        default:
          return nextRenderElement && nextRenderElement(props);
      }
    } else if (nextRenderElement) {
      return nextRenderElement(props);
    }
    return undefined;
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === TYPE_HEADING) {
      // Remove empty headers, but not when cursor is placed inside it.
      if (
        Node.string(node) === '' &&
        (!Range.isRange(editor.selection) ||
          (Range.isRange(editor.selection) &&
            Range.isCollapsed(editor.selection) &&
            !Path.isCommon(path, editor.selection.anchor.path)))
      ) {
        Transforms.unwrapNodes(editor, { at: path });
        return;
      }
    }

    nextNormalizeNode(entry);
  };

  editor.onKeyDown = (e: KeyboardEvent) => {
    if (e.key === KEY_ENTER) {
      onEnter(e, editor, nextOnKeyDown);
    } else if (e.key === KEY_BACKSPACE) {
      onBackspace(e, editor, nextOnKeyDown);
    } else if (nextOnKeyDown) {
      nextOnKeyDown(e);
    }
  };

  return editor;
};
