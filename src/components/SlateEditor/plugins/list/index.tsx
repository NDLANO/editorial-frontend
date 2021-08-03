import React from 'react';
import { Editor, Node, Element, Descendant, Transforms, Text, Path } from 'slate';
import { RenderElementProps } from 'slate-react';
import { jsx } from 'slate-hyperscript';
import { Dictionary } from 'lodash';
import { SlateSerializer } from '../../interfaces';
import onEnter from './handlers/onEnter';
import { firstTextBlockElement } from '../../utils/normalizationHelpers';
import { TYPE_PARAGRAPH } from '../paragraph/utils';
import { defaultListBlock } from './utils/defaultBlocks';
import onTab from './handlers/onTab';
import onBackspace from './handlers/onBackspace';

export const LIST_TYPES = ['numbered-list', 'bulleted-list', 'letter-list'];
export const TYPE_LIST = 'list';
export const TYPE_LIST_ITEM = 'list-item';

const KEY_ENTER = 'Enter';
const KEY_TAB = 'Tab';
const KEY_BACKSPACE = 'Backspace';

export interface ListElement {
  type: 'list';
  listType: string;
  data: Dictionary<string>;
  children: Descendant[];
}

export interface ListItemElement {
  type: 'list-item';
  children: Descendant[];
  changeTo?: string;
  moveUp?: boolean;
  moveDown?: boolean;
}

export const listSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'ul') {
      return jsx('element', { type: TYPE_LIST, listType: 'bulleted-list', data: {} }, children);
    }
    if (tag === 'ol') {
      const start = el.getAttribute('start');
      if (el.getAttribute('data-type') === 'letters') {
        return jsx(
          'element',
          { type: TYPE_LIST, listType: 'letter-list', data: { start } },
          children,
        );
      }
      // Default to numbered list if no type is set.
      else {
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
  serialize(node: Descendant, children: (JSX.Element | null)[]) {
    if (!Element.isElement(node)) return;
    if (node.type === TYPE_LIST) {
      if (node.listType === 'bulleted-list') {
        return <ul>{children}</ul>;
      }
      if (node.listType === 'numbered-list') {
        const { start } = node.data;

        return <ol start={start ? parseInt(start) : undefined}>{children}</ol>;
      }
      if (node.listType === 'letter-list') {
        const { start } = node.data;
        return (
          <ol data-type="letters" start={start ? parseInt(start) : undefined}>
            {children}
          </ol>
        );
      }
    }
    if (node.type === TYPE_LIST_ITEM) {
      return <li>{children}</li>;
    }
  },
};

export const listPlugin = (editor: Editor) => {
  const { onKeyDown, renderElement, normalizeNode } = editor;
  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === TYPE_LIST) {
      if (element.listType === 'bulleted-list') {
        return (
          <ul className="c-block__bulleted-list" {...attributes}>
            {children}
          </ul>
        );
      } else if (element.listType === 'numbered-list') {
        const { start } = element.data;

        return (
          <ol {...attributes} className={start ? `ol-reset-${start}` : ''}>
            {children}
          </ol>
        );
      } else if (element.listType === 'letter-list') {
        const { start } = element.data;
        return (
          <ol
            data-type="letters"
            className={`ol-list--roman ${start ? `ol-reset-${start}` : ''}`}
            {...attributes}>
            {children}
          </ol>
        );
      }
    } else if (element.type === TYPE_LIST_ITEM) {
      return (
        <li className="c-block__list-item" {...attributes}>
          {children}
        </li>
      );
    } else if (renderElement) {
      return renderElement({ attributes, children, element });
    }
    return undefined;
  };

  editor.normalizeNode = entry => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === TYPE_LIST_ITEM) {
      // If listItem is not placed insine list, unwrap it.
      const [parentNode] = Editor.node(editor, Path.parent(path));
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

      // Handle changing list-items marked for listType change
      if (node.changeTo) {
        const changeTo = node.changeTo;
        Editor.withoutNormalizing(editor, () => {
          Transforms.unsetNodes(editor, ['changeTo'], { at: path });
          Transforms.wrapNodes(editor, defaultListBlock(changeTo), { at: path });
          Transforms.liftNodes(editor, { at: path });
        });
        return;
      }
    }
    if (Element.isElement(node) && node.type === TYPE_LIST) {
      // If list is empty, remove it
      if (node.children.length === 0) {
        return Transforms.removeNodes(editor, { at: path });
      }

      // Merge list with previous list if identical type
      if (Path.hasPrevious(path)) {
        const prevPath = Path.previous(path);
        if (Editor.hasPath(editor, prevPath)) {
          const [prevNode] = Editor.node(editor, prevPath);

          if (Element.isElement(prevNode) && prevNode.type === TYPE_LIST) {
            if (node.listType === prevNode.listType) {
              return Transforms.mergeNodes(editor, {
                at: path,
              });
            }
          }
        }
      }

      // Merge list with next list if identical type
      const nextPath = Path.next(path);
      if (Editor.hasPath(editor, nextPath)) {
        const [nextNode] = Editor.node(editor, nextPath);

        if (Element.isElement(nextNode) && nextNode.type === TYPE_LIST) {
          if (node.listType === nextNode.listType && nextNode.children.length > 0) {
            return Transforms.mergeNodes(editor, {
              at: nextPath,
            });
          }
        }
      }
    }

    normalizeNode(entry);
  };

  editor.onKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case KEY_ENTER:
        return onEnter(event, editor, onKeyDown);
      case KEY_TAB:
        return onTab(event, editor, onKeyDown);
      case KEY_BACKSPACE:
        return onBackspace(event, editor, onKeyDown);
      default:
        if (onKeyDown) return onKeyDown(event);
        else return undefined;
    }
  };
  return editor;
};
