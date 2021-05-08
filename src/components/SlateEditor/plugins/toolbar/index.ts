/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { KeyboardEvent } from 'react';
import { isKeyHotkey, isCodeHotkey } from 'is-hotkey';
import { Editor } from 'slate';
import SlateToolbar from './SlateToolbar';
import { toggleMark } from '../mark/utils';
import { handleClickBlock, handleClickInline } from './handleMenuClicks';

const isBoldHotkey = isKeyHotkey('mod+b');
const isCodeHotKey = isKeyHotkey('mod+k');
const isConceptBlockHotKey = isCodeHotkey('mod+alt+c');
const isH2HotKey = isKeyHotkey('mod+2');
const isH3HotKey = isKeyHotkey('mod+3');
const isFootnoteHotKey = isCodeHotkey('mod+alt+f');
const isItalicHotKey = isKeyHotkey('mod+i');
const isLetteredListHotKey = isCodeHotkey('mod+alt+a');
const isLinkHotKey = isCodeHotkey('mod+alt+l');
const isListHotKey = isKeyHotkey('mod+l');
const isMathHotKey = isKeyHotkey('mod+m');
const isNumberedListHotKey = isCodeHotkey('mod+alt+1');
const isQuoteHotKey = isCodeHotkey('mod+alt+b');
const isSubHotKey = isCodeHotkey('mod+alt+s');
const isSupHotKey = isCodeHotkey('mod+alt+h');

const toolbarPlugin = (editor: Editor) => {
  const { onKeyDown: nextOnKeyDown } = editor;

  editor.onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let inline;
    let mark;
    let block;
    if (isBoldHotkey(e)) {
      mark = 'bold';
    } else if (isCodeHotKey(e)) {
      mark = 'code';
      // } else if (isConceptBlockHotKey(e)) {
      //   inline = 'concept';
    } else if (isFootnoteHotKey(e)) {
      inline = 'footnote';
    } else if (isH2HotKey(e)) {
      block = 'heading-2';
    } else if (isH3HotKey(e)) {
      block = 'heading-3';
    } else if (isItalicHotKey(e)) {
      mark = 'italic';
      // } else if (isLetteredListHotKey(e)) {
      //   block = 'letter-list';
    } else if (isLinkHotKey(e)) {
      inline = 'link';
      // } else if (isListHotKey(e)) {
      //   block = 'bulleted-list';
    } else if (isMathHotKey(e)) {
      inline = 'mathml';
      // } else if (isNumberedListHotKey(e)) {
      //   block = 'numbered-list';
    } else if (isQuoteHotKey(e)) {
      block = 'quote';
    } else if (isSubHotKey(e)) {
      mark = 'sub';
    } else if (isSupHotKey(e)) {
      mark = 'sup';
    }

    if (mark) {
      toggleMark(e, editor, mark);
    } else if (block) {
      handleClickBlock(e, editor, block);
    } else if (inline) {
      handleClickInline(e, editor, inline);
    } else if (nextOnKeyDown) {
      nextOnKeyDown(e);
    }
  };
  return editor;
};

export { SlateToolbar, toolbarPlugin };
