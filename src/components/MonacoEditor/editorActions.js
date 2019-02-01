/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export function createFormatAction(monaco) {
  return {
    id: 'prettier-format',
    label: 'Format',

    keybindings: [
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_F,
    ],

    contextMenuGroupId: 'modification',
    contextMenuOrder: 1.5,

    run: async function(editor) {
      const model = editor.getModel();
      const data = await fetch(`/prettify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: model.getValue() }),
      });
      const { prettified } = await data.json();
      model.setValue(prettified);

      return null;
    },
  };
}
