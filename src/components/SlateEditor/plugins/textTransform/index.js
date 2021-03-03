/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export default function textTransformPlugin() {
  const schema = {
    document: {},
  };

  const onKeyDown = (e, editor, next) => {
    if (e.key === '<') {
      replaceConsecutiveChars(e, editor, '<', '«');
    } else if (e.key === '>') {
      replaceConsecutiveChars(e, editor, '>', '»');
    }

    next();
  };

  const replaceConsecutiveChars = (event, editor, char, replacement) => {
    const start = editor.value.selection.start;
    if (start.offset > 0) {
      const startText = editor.value.startText;
      const previousChar = startText.text.slice(start.offset - 1, start.offset);
      if (previousChar === char) {
        event.preventDefault();
        editor.moveStartBackward(1).insertText(replacement);
      }
    }
  };

  return {
    schema,
    onKeyDown,
  };
}
