import React, { KeyboardEvent, KeyboardEventHandler } from 'react';
import { Editor, Node, Element, Descendant, Transforms, Text, Path } from 'slate';
import { RenderElementProps } from 'slate-react';
import { jsx } from 'slate-hyperscript';
import { SlateSerializer } from '../../interfaces';
import { reduceElementDataAttributes, createDataProps } from '../../../../util/embedTagHelpers';
import onEnter from './handlers/onEnter';
import { Dictionary } from 'lodash';
import { firstTextBlockElement } from '../../utils/normalizationHelpers';
import { TYPE_PARAGRAPH } from '../paragraph/utils';

export const LIST_TYPES = ['numbered-list', 'bulleted-list', 'letter-list'];
export const TYPE_LIST = 'list';
export const TYPE_LIST_ITEM = 'list-item';

export interface ListElement {
  type: 'list';
  listType: string;
  data: Dictionary<string>;
  children: Descendant[];
}

export interface ListItemElement {
  type: 'list-item';
  children: Descendant[];
}

export const listSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'ul') {
      return jsx('element', { type: TYPE_LIST, listType: 'bulleted-list', data: {} }, children);
    }
    if (tag === 'ol') {
      if (el.getAttribute('data-type') === 'letters') {
        return jsx('element', { type: TYPE_LIST, listType: 'letter-list', data: {} }, children);
      }
      // Default to numbered list if no type is set.
      else {
        const start = el.getAttribute('start');
        return jsx(
          'element',
          { type: TYPE_LIST, listType: 'numbered-list', data: { start } },
          children,
        );
      }
    }
    if (tag === 'li') {
      return jsx('element', { type: TYPE_LIST_ITEM }, children);
    }
  },
  serialize(node: Descendant, children: string) {
    if (!Element.isElement(node)) return;
    if (node.type === TYPE_LIST) {
      if (node.listType === 'bulleted-list') {
        return `<ul>${children}</ul>`;
      }
      if (node.listType === 'numbered-list') {
        const { start } = node.data;

        return `<ol${start ? ` start="${start}"` : ''}>${children}</ol>`;
      }
      if (node.listType === 'letter-list') {
        return `<ol data-type='letters'>${children}</ol>`;
      }
    }
    if (node.type === TYPE_LIST_ITEM) {
      return `<li>${children}</li>`;
    }
  },
};

export const listPlugin = (editor: Editor) => {
  const { onKeyDown, renderElement, normalizeNode } = editor;
  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === TYPE_LIST) {
      if (element.listType === 'bulleted-list') {
        return <ul {...attributes}>{children}</ul>;
      } else if (element.listType === 'numbered-list') {
        return <ol {...attributes}>{children}</ol>;
      } else if (element.listType === 'letter-list') {
        return (
          <ol data-type="letters" className="ol-list--roman" {...attributes}>
            {children}
          </ol>
        );
      }
    } else if (element.type === TYPE_LIST_ITEM) {
      return <li {...attributes}>{children}</li>;
    } else if (renderElement) {
      return renderElement({ attributes, children, element });
    }
    return undefined;
  };

  editor.normalizeNode = entry => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === TYPE_LIST_ITEM) {
      // If listItem is not placed insine list, unwrap it.
      const [parentNode, parentPath] = Editor.node(editor, Path.parent(path));
      if (Element.isElement(parentNode) && parentNode.type !== TYPE_LIST) {
        return Transforms.unwrapNodes(editor, { at: path });
      }

      // If listItem contains text, wrap it in paragraph.
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Text.isText(child)) {
          Transforms.wrapNodes(
            editor,
            {
              type: TYPE_PARAGRAPH,
              children: [],
            },
            { at: childPath },
          );
          return;
        }
      }

      // If first child is not a paragraph or heading, insert an empty paragraph
      const firstChild = node.children[0];
      if (Element.isElement(firstChild)) {
        if (!firstTextBlockElement.includes(firstChild.type)) {
          Transforms.insertNodes(
            editor,
            {
              type: TYPE_PARAGRAPH,
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
        if (lastChild.type !== TYPE_PARAGRAPH && lastChild.type !== TYPE_LIST) {
          Transforms.insertNodes(
            editor,
            {
              type: TYPE_PARAGRAPH,
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
    if (Element.isElement(node) && node.type === TYPE_LIST) {
      if (node.children.length === 0) {
        return Transforms.removeNodes(editor, { at: path });
      }

      const nextPath = Path.next(path);
      if (Editor.hasPath(editor, nextPath)) {
        const [nextNode] = Editor.node(editor, nextPath);

        if (Element.isElement(nextNode) && nextNode.type === TYPE_LIST) {
          if (node.listType === nextNode.listType) {
            return Transforms.moveNodes(editor, {
              at: nextPath,
              to: [...path, nextNode.children.length],
              match: node => Element.isElement(node) && node.type === TYPE_LIST_ITEM,
              mode: 'highest',
            });
          }
        }
      }
    }

    normalizeNode(entry);
  };

  editor.onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'Enter':
        return onEnter(event, editor, onKeyDown);
      default:
        if (onKeyDown) return onKeyDown(event);
        else return undefined;
    }
  };
  return editor;
};
