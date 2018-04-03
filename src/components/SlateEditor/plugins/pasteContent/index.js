/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getEventTransfer } from 'slate-react';
import { defaultBlockWithText } from '../../schema';

// Invisible characters
// Has to obey: https://eslint.org/docs/rules/no-control-regex
const tabCharacter = new RegExp('/u0009/g');
const invisibleCharacters1 = new RegExp('x00-/u');
const invisibleCharacters2 = new RegExp('x1F/u');

const printAbleLetters = /[\x20-\x7F]/g;
const norwegianLetters = /[\xC6\xE6\xF8\xD8\xE5\xC5]/g; // æÆøØåÅ
const crCharacter = /\r/;

export const replacer = (str, change) => {
  const lines = str.split(crCharacter);
  lines.forEach(line => {
    if (line.match(printAbleLetters) || line.match(norwegianLetters)) {
      const newString = line
        .replace(invisibleCharacters1, '')
        .replace(invisibleCharacters2, '')
        .replace(/[\x7F-\xBF]/u, '')
        .replace(tabCharacter, ' ');
      change.insertBlock(defaultBlockWithText(newString));
    }
  });
};
/* eslint-enable no-control-regex */

export default function pasteContentPlugin() {
  function onPaste(evt, change) {
    const transfer = getEventTransfer(evt);
    const str = transfer.text;
    replacer(str, change);
    return change;
  }
  return {
    schema: {},
    onPaste,
  };
}
