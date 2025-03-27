/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import SlatePitch from "./SlatePitch";
import { PITCH_ELEMENT_TYPE } from "./types";

export const pitchRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === PITCH_ELEMENT_TYPE) {
      return (
        <SlatePitch editor={editor} element={element} attributes={attributes}>
          {children}
        </SlatePitch>
      );
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
