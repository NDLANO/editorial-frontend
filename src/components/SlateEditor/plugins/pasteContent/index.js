/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const illegalListCharacters = /[\u2022\u00AC\u2663]/g;

const tabCharacter = /\u0009/g;
export default function pasteContentPlugin() {
  function onPaste(evt, data, change) {
    const str = data.text;
    if (str.match(illegalListCharacters)) {
      const newString = str
        .replace(illegalListCharacters, '')
        .replace(tabCharacter, ' ');
      change.insertText(newString);
      return change;
    }
    return undefined;
  }
  return {
    schema: {},
    onPaste,
  };
}
