import React from 'react';
import { Editor, Element, Descendant } from 'new-slate';
import { jsx } from 'new-slate-hyperscript';
import { RenderElementProps } from 'new-slate-react';
import { SlateSerializer } from '../../interfaces';
const TYPE = 'br';

export interface BreakElement {
  type: 'br';
  children: any;
}

export const breakSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE) return;
    return jsx('element', { type: TYPE }, [{ text: '' }]);
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node)) return;
    if (node.type !== 'br') return;

    return `<br>`;
  },
};

export const breakPlugin = (editor: Editor) => {
  const { renderElement: nextRenderELement, isVoid: nextIsVoid } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === 'br') {
      return <br {...attributes} />;
    } else if (nextRenderELement) {
      return nextRenderELement({ attributes, children, element });
    }
    return undefined;
  };

  editor.isVoid = (element: Element) => {
    if (element.type === 'br') {
      return true;
    }
    return nextIsVoid(element);
  };
  return editor;
};
