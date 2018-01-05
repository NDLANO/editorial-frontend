/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getEventTransfer } from 'slate-react';
import { defaultBlockWithText } from '../../schema';

const printAbleLetters = /[\x20-\x7F]/g;
const tabCharacter = /\u0009/g;
const norwegianLetters = /[\xC6\xE6\xF8\xD8\xE5\xC5]/g // æÆøØåÅ
const crCharacter = /\r/;

export const replacer = (str, change) => {
  const lines = str.split(crCharacter);
  lines.forEach(line => {
    if (line.match(printAbleLetters) || line.match(norwegianLetters)) {
      const newString = line
        .replace(/[\x00-\x1F\x7F-\xFF]/u, '')
        .replace(tabCharacter, ' ');
      change.insertBlock(defaultBlockWithText(newString));
    }
  });
}

export default function pasteContentPlugin() {
  function onPaste(evt, change) {
    const transfer = getEventTransfer(evt);
    const str = transfer.text;
    replacer(str, change)
    return change;
  }
  return {
    schema: {},
    onPaste,
  };
}
