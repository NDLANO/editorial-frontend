/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from 'new-slate';
import { KeyboardEvent } from 'react';
import { insertLink } from '../link/utils';
import { toggleBlock } from '../../utils';
import { toggleHeading } from '../heading/utils';
import { insertFootnote } from '../footnote/utils';

// TODO: Rewrite functions to Slate 0.62 or remove when
// new functions are written.

export function handleClickBlock(
  event: KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  type: string,
) {
  event.preventDefault();
  if (type === 'quote') {
    toggleBlock(editor, type);
  } else if (type === 'heading-2') {
    toggleHeading(editor, 2);
  } else if (type === 'heading-3') {
    toggleHeading(editor, 3);
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

export function handleClickInline(
  event: KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  type: string,
) {
  event.preventDefault();
  if (editor.selection) {
    if (type === 'link') {
      insertLink(editor);
    }
    if (type === 'footnote') {
      insertFootnote(editor);
    }
  }

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
