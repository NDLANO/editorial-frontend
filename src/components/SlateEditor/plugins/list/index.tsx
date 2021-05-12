import React, { KeyboardEvent, KeyboardEventHandler } from 'react';
import { Editor, Node, Element, Descendant } from 'new-slate';
import { RenderElementProps } from 'new-slate-react';
import { jsx } from 'new-slate-hyperscript';
import { CustomText, SlateSerializer } from '../../interfaces';
import { reduceElementDataAttributes, createDataProps } from '../../../../util/embedTagHelpers';
import onEnter from './handlers/onEnter';

const LIST_TYPES = ['numbered-list', 'bulleted-list', 'letter-list'];
const TYPE = 'list_item';
const TYPE_DEFAULT = 'paragraph';

export interface ListElement {
    type: 'list_item';
    listType: string;
    text: string;
}

export const listSerializer: SlateSerializer = {
    deserialize(el: HTMLElement, children: (Descendant | null)[]) {
        const tag = el.tagName.toLowerCase();
        if (tag === 'li') {
            return jsx('element', { type: TYPE }, children);
        }
    },
    serialize(node: Descendant, children: string) {
    if (!Element.isElement(node)) return;
    if (node.type === TYPE) {
      return `<li>${children}</li>`;
    }
  },
}

export const listPlugin = (editor: Editor) => {
    const { onKeyDown: nextOnKeyDown, renderElement: nextRenderElement } = editor;
    editor.renderElement = ({ attributes, children, element}: RenderElementProps) => {
        if (element.type === TYPE ) {
            if (element.listType === 'bulleted-list') {
                return  <ul {...attributes}>{children}</ul>
            }
            else if (element.listType === 'numbered-list') {
                return <ol type="1" {...attributes}>{children}</ol>
            }
            else if (element.listType === 'lettered-list') {
                return <ol type="A" {...attributes}>{children}</ol>
            }
        } else if (nextRenderElement) {
            return nextRenderElement({ attributes, children, element });
        }
        return undefined;
    }

    editor.onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        switch(event.key) {
            case 'Enter':
                return onEnter(event, editor, nextOnKeyDown);
            default:
                if (nextOnKeyDown) return nextOnKeyDown(event);
                else return undefined;
        }
    }
    return editor;
}