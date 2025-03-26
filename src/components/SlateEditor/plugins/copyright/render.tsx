/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import SlateCopyright from "./SlateCopyright";
import { COPYRIGHT_ELEMENT_TYPE } from "./types";

export const copyrightRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === COPYRIGHT_ELEMENT_TYPE) {
      return (
        <SlateCopyright attributes={attributes} element={element} editor={editor}>
          {children}
        </SlateCopyright>
      );
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
