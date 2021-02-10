/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { isCodeHotkey, isKeyHotkey } from 'is-hotkey';
import SlateToolbar from './SlateToolbar';
import { handleClickBlock, handleClickMark, handleClickInline } from './handleMenuClicks';

const onButtonClick = (event, editor, kind, type) => {
  if (kind === 'mark') {
    handleClickMark(event, editor, type);
  } else if (kind === 'block') {
    handleClickBlock(event, editor, type);
  } else if (kind === 'inline') {
    handleClickInline(event, editor, type);
  }
};

export default function toolbarPlugin() {
  const schema = {};
  const renderEditor = (props, editor, next) => {
    // eslint-disable-next-line react/prop-types
    const { onChange, name, index } = props;
    const children = next();
    return (
      <>
        {children}
        <SlateToolbar
          editor={editor}
          onChange={change =>
            onChange(
              {
                target: {
                  name,
                  value: change.value,
                  type: 'SlateEditorValue',
                },
              },
              index,
            )
          }
          onButtonClick={onButtonClick}
          name={name}
        />
      </>
    );
  };

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
  const isQuoteHotKey = isCodeHotkey('mod+alt+q');
  const isSubHotKey = isCodeHotkey('mod+alt+s');
  const isSupHotKey = isCodeHotkey('mod+alt+h');

  const onKeyDown = (e, editor, next) => {
    let mark, block, inline;
    if (isBoldHotkey(e)) {
      mark = 'bold';
    } else if (isCodeHotKey(e)) {
      mark = 'code';
    } else if (isConceptBlockHotKey(e)) {
      inline = 'concept';
    } else if (isFootnoteHotKey(e)) {
      inline = 'footnote';
    } else if (isH2HotKey(e)) {
      block = 'heading-two';
    } else if (isH3HotKey(e)) {
      block = 'heading-three';
    } else if (isItalicHotKey(e)) {
      mark = 'italic';
    } else if (isLetteredListHotKey(e)) {
      block = 'letter-list';
    } else if (isLinkHotKey(e)) {
      inline = 'link';
    } else if (isListHotKey(e)) {
      block = 'bulleted-list';
    } else if (isMathHotKey(e)) {
      inline = 'mathml';
    } else if (isNumberedListHotKey(e)) {
      block = 'numbered-list';
    } else if (isQuoteHotKey(e)) {
      block = 'quote';
    } else if (isSubHotKey(e)) {
      mark = 'sub';
    } else if (isSupHotKey(e)) {
      mark = 'sup';
    }

    if (mark) {
      handleClickMark(e, editor, mark);
    } else if (block) {
      handleClickBlock(e, editor, block);
    } else if (inline) {
      handleClickInline(e, editor, inline);
    } else {
      next();
    }
  };

  return {
    schema,
    onKeyDown,
    renderEditor,
  };
}
