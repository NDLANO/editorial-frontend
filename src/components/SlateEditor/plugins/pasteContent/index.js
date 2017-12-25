/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getEventTransfer } from 'slate-react';
import { defaultBlockWithText } from '../../schema';
// const illegalListCharacters = /[\u2022\u00AC\u2663]/g;
const printAbleASCII = /[\x20-\x7F]/g;
const tabCharacter = /\u0009/g;

const crCharacter = /\r/;

export default function pasteContentPlugin() {
  function onPaste(evt, change) {
    const transfer = getEventTransfer(evt);
    const str = transfer.text;
    const lines = str.split(crCharacter);
    lines.map(line => {
      if (line.match(printAbleASCII)) {
        const newString = line
          .replace(/[\x00-\x1F\x7F-\xFF]/u, '')
          .replace(tabCharacter, ' ');
        change.insertBlock(defaultBlockWithText(newString));
        return change;
      }
      return undefined;
    });
    return change;
  }
  return {
    schema: {},
    onPaste,
  };
}
