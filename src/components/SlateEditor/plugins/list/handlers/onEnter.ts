import React, { KeyboardEvent, KeyboardEventHandler } from 'react';
import { Editor, Node, Element, Descendant, Range } from 'new-slate';
import { RenderElementProps } from 'new-slate-react';
import { jsx } from 'new-slate-hyperscript';
import { CustomText, SlateSerializer } from '../../interfaces';
import { reduceElementDataAttributes, createDataProps } from '../../../../util/embedTagHelpers';
import getCurrentItem from '../utils/getCurrentItem';


const onEnter = (event: KeyboardEvent<HTMLDivElement>, 
    editor: Editor, 
next?: KeyboardEventHandler<HTMLDivElement>) => {
    // If shift+enter use default behaviour.
    if (event.shiftKey && next) return next(event);

    // If no selection use default behaviour.
    if (!editor.selection && next) return next(event);
    else if (!editor.selection) return undefined;

    const currentItem = getCurrentItem(editor);
    // Not in a list
    if (!currentItem && next) {
        return next(event);
    }
    if(currentItem && currentItem?.type !== 'list_item') {
        if (next) return next(event);
        else return undefined;
    }

    event.preventDefault();

    // If expanded, delete first.
    if (Range.isExpanded(editor.selection)) {
        Editor.deleteForward(editor);
    }

    if (!Editor.isVoid(editor, editor.selection) && currentItem?.text === '') {
        // Block is empty, we exit the list
        if (editor.getItemDepth() > 1) {
            return editor.decreaseItemDepth();
        }
        // Exit list
        return editor.unwrapList();
    }
    // Split list item
    return editor.splitListItem();
}

export default onEnter;
