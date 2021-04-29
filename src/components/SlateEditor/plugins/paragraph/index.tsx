import React, { KeyboardEvent, KeyboardEventHandler } from 'react';
import { Editor, Node, Element, Descendant, Text } from 'new-slate';
import { RenderElementProps } from 'new-slate-react';
import { jsx } from 'new-slate-hyperscript';
import { SlateSerializer } from '../../interfaces';
import { reduceElementDataAttributes, createDataProps } from '../../../../util/embedTagHelpers';
import { ContentLinkElement, LinkElement } from '../link';

const KEY_ENTER = 'Enter';
const TYPE = 'paragraph';

export interface ParagraphElement {
  type: 'paragraph';
  data?: {
    'data-align'?: string;
    align?: string;
  };
  children: (Text | LinkElement | ContentLinkElement)[];
}

const getCurrentParagraph = (editor: Editor) => {
  if (!editor.selection?.anchor) return null;
  const startBlock = Node.parent(editor, editor.selection?.anchor.path);
  if (!Element.isElement(startBlock)) {
    return null;
  }
  return startBlock && startBlock?.type === 'paragraph' ? startBlock : null;
};

const onEnter = (
  e: KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  nextOnKeyDown?: KeyboardEventHandler<HTMLDivElement>,
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
  if (Node.string(currentParagraph) === '') {
    editor.deleteBackward('character');
    editor.insertNode({
      type: 'br',
      children: [{ text: '' }],
    });
    editor.insertNode({
      type: TYPE,
      children: [{ text: '' }],
    });
    return;
  }

  if (e.shiftKey === true) {
    return editor.insertText('\n');
  }

  return editor.insertNode({
    type: TYPE,
    children: [{ text: '' }],
  });
};

export const paragraphSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    if (el.tagName.toLowerCase() !== 'p') return;

    return jsx(
      'element',
      { type: TYPE, data: reduceElementDataAttributes(el, ['align', 'data-align']) },
      children,
    );
  },
  serialize(node: Descendant, children: string) {
    if (!Element.isElement(node)) return;
    if (node.type !== 'paragraph' /*&& node.type !== 'line'*/) return;

    /**
      We insert empty p tag throughout the document to enable positioning the cursor
      between element with no spacing (i.e two images). We need to remove these element
      on seriaization.
     */
    if (Node.string(node) === '') return null;

    const dataProps = node.data ? createDataProps(node.data) : {};
    return `<p${Object.entries(dataProps).map((key, val) => {
      return ` "${key}"="${val}"`;
    })}>${children}</p>`;
  },
};

export const paragraphPlugin = (editor: Editor) => {
  const { onKeyDown: nextOnKeyDown, renderElement: nextRenderElement } = editor;

  editor.onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === KEY_ENTER) {
      onEnter(e, editor, nextOnKeyDown);
    } else if (nextOnKeyDown) {
      nextOnKeyDown(e);
    }
  };

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === 'paragraph') {
      return <p {...attributes}>{children}</p>;
    } else if (nextRenderElement) {
      return nextRenderElement({ attributes, children, element });
    }
    return undefined;
  };

  return editor;
};
