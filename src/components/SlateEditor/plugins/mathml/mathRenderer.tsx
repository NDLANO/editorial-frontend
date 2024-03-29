/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import MathEditor from "./MathEditor";
import { TYPE_MATHML } from "./types";

export const mathRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_MATHML) {
      return (
        <MathEditor element={element} attributes={attributes} editor={editor}>
          {children}
        </MathEditor>
      );
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
