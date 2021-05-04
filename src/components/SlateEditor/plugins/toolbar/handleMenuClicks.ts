/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Transforms, Element } from 'new-slate';
import { KeyboardEvent } from 'react';
import { insertLink } from '../link/utils';
import { isBlockActive } from '../../utils';

// TODO: Rewrite functions to Slate 0.62 or remove when
// new functions are written.

export function handleClickBlock(
  event: KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  type: string,
) {
  // TODO: Move to function "toggleQuote" in blockquote plugin?
  if (type === 'quote') {
    const isActive = isBlockActive(editor, type);

    if (isActive) {
      Transforms.unwrapNodes(editor, {
        mode: 'lowest',
        match: node => Element.isElement(node) && node.type === 'quote',
      });
    } else {
      Transforms.wrapNodes(
        editor,
        { type: 'quote' },
        {
          mode: 'lowest',
          match: node => Element.isElement(node) && node.type === 'paragraph',
        },
      );
    }
    // TODO: Upgrade. Old code for handling lists
    //   // Current list type is active
    //   if (isListTypeActive) {
    //     editor.unwrapList();
    //     // Current selection is list, but not the same type
    //   } else if (editor.isSelectionInList()) {
    //     editor.unwrapList();
    //     editor.wrapInList(type);
    //     // No list found, wrap in list type
    //   } else {
    //     editor.wrapInList(type);
    //   }
    // }
  }
}

export function handleClickInline(
  event: KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  type: string,
) {
  if (editor.selection) {
    if (type === 'link') {
      insertLink(editor);
    }
  }
  // stripSpacesFromSelectedText(editor);

  // if (type === 'footnote') {
  //   addTextAndWrapIntype(editor, '#', type);
  // } else if (type === 'mathml') {
  //   const { value } = editor;
  //   if (value.selection.start.offset !== value.selection.end.offset) {
  //     editor.wrapInline(type);
  //   } else {
  //     addTextAndWrapIntype(editor, ' ', type);
  //   }
  // } else {
  //   editor.withoutNormalizing(() => {
  //     editor.wrapInline(type);
  //   });
  // }
}

function addTextAndWrapIntype(editor, text, type) {
  editor
    .moveToEnd()
    .insertText(text)
    .moveFocusForward(-text.length)
    .wrapInline(type);
}

/**
 * Default windows behaviour when selecting text via double click is to select the word + the following space.
 * This function checks the selected text and removes 1 space from each end.
 * Selections spanning more than one text is supported.
 */
function stripSpacesFromSelectedText(editor) {
  const { value } = editor;
  if (value.selection.start.offset === value.selection.end.offset) {
    return;
  }
  const { startText, endText } = value;
  const selectedStartText = startText.text.slice(value.selection.start.offset);
  if (selectedStartText.startsWith(' ')) {
    editor.moveStartForward(1);
  }
  const selectedEndText = endText.text.slice(value.selection.end.offset - 1);
  if (selectedEndText.startsWith(' ')) {
    editor.moveEndBackward(1);
  }
}
