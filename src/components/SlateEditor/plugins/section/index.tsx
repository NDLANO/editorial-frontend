import { Node, Element, Descendant, Editor, Text, Transforms } from 'new-slate';
import { jsx } from 'new-slate-hyperscript';
import { RenderElementProps } from 'new-slate-react';
import React from 'react';
import { SlateSerializer } from '../../interfaces';

const TYPE_SECTION = 'section';

export interface SectionElement {
  type: 'section';
  children: Descendant[];
}

export const sectionSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: (Descendant[] | Descendant | null)[]) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'section') {
      return jsx('element', { type: TYPE_SECTION }, children);
    }
    if (tag === 'body') {
      return jsx('fragment', {}, children);
    }
    return;
  },
  serialize(node: Element, children: string) {
    if (!Node.isNode(node)) return;
    if (node.type === 'section') {
      return `<section>${children}</section>`;
    }
  },
};

export const sectionPlugin = (editor: Editor) => {
  const { renderElement: nextRenderElement, normalizeNode: nextNormalizeNode } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === 'section') {
      return <section {...attributes}>{children}</section>;
    } else if (nextRenderElement) {
      return nextRenderElement({ attributes, children, element });
    }
    return undefined;
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
