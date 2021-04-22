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

export const blockSerializer: SlateSerializer = {
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

export const blockPlugin = (editor: Editor) => {
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
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Text.isText(child)) {
          console.log('loop');
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
    }
    nextNormalizeNode(entry);
  };

  return editor;
};
