import React, { KeyboardEvent, KeyboardEventHandler } from 'react';
import { Editor, Node, Element, Descendant } from 'new-slate';
import { RenderElementProps } from 'new-slate-react';
import { jsx } from 'new-slate-hyperscript';
import { SlateSerializer } from '../../interfaces';
import { reduceElementDataAttributes, createDataProps } from '../../../../util/embedTagHelpers';
import onEnter from './handlers/onEnter';
import { ParagraphElement } from '../paragraph';

export const LIST_TYPES = ['numbered-list', 'bulleted-list', 'letter-list'];
export const LIST_TYPE = 'list_item';
const TYPE_DEFAULT = 'list_text';

export interface ListElement {
    type: 'list_item';
    listType?: string;
    children: Descendant | null;
}

export interface ListText extends Omit<ParagraphElement, 'type'> {
    type: 'list_text';
}

export const listSerializer: SlateSerializer = {
    deserialize(el: HTMLElement, children: (Descendant | null)[]) {
        const tag = el.tagName.toLowerCase();
        if (tag === 'ul') {
            return jsx('element', { type: LIST_TYPE, listType: 'bulleted-list', className: 'o-list--bullets'}, children)
        }
        if (tag === 'ol') {
            if (el.getAttribute('data-type') === 'letters') {
                return jsx('element', { type: LIST_TYPE, listType: 'lettered-list', className: 'ol-list--roman'}, children)
            }
            if (el.getAttribute('type') === '1') {
                return jsx('element', { type: LIST_TYPE, listType: 'numbered-list'}, children)
            }
            // Default to numbered list if no type is set.
            else return jsx('element', { type: LIST_TYPE, listType: 'numbered-list'}, children)
        }
        if (tag === 'li') {
            return jsx('element', { type: LIST_TYPE, listType: TYPE_DEFAULT, class: 'c-block__list-item'}, children);
        }
    },
    serialize(node: Descendant, children: string) {
    if (!Element.isElement(node)) return;
    if (node.type === LIST_TYPE) {
        if (node.listType === 'bulleted-list') {
            return `<ul>${children}</ul>`
        }
        if (node.listType === 'numbered-list') {
            return `<ol type='1'>${children}</ol>`
        }
        if (node.listType === 'lettered-list') {
            return `<ol data-type='letters'>${children}</ol>`
        }
        if (node.listType === TYPE_DEFAULT) {
            return `<li>${children}</li>`;
        }
    }
  },
}

export const listPlugin = (editor: Editor) => {
    const { onKeyDown: nextOnKeyDown, renderElement: nextRenderElement } = editor;
    editor.renderElement = ({ attributes, children, element}: RenderElementProps) => {
        if (element.type === LIST_TYPE ) {
            if (element.listType === 'bulleted-list') {
                return  <ul {...attributes}>{children}</ul>
            }
            else if (element.listType === 'numbered-list') {
                return <ol {...attributes}>{children}</ol>
            }
            else if (element.listType === 'lettered-list') {
                return <ol data-type="letters" className="ol-list--roman" {...attributes}>{children}</ol>
            }
            else if (element.listType === TYPE_DEFAULT) {
                return <li {...attributes}>{children}</li>
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