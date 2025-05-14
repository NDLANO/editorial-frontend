/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import { ReactEditor } from "slate-react";

export const restoreFocusOnPopperExit = (editor: Editor) => {
  // I don't know why this works, but it does.
  // See https://github.com/ianstormtaylor/slate/issues/5810#issuecomment-2676971341
  // Apparently, we need to sync the editor state with the DOM before we can focus it, even though we haven't made any changes.
  editor.onChange();
  ReactEditor.focus(editor);
};
