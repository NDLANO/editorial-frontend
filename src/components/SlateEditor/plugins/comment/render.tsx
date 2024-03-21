/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import SlateComment from "./SlateComment";
import { TYPE_COMMENT } from "./types";

export const commentRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_COMMENT) {
      return (
        <SlateComment element={element} attributes={attributes} editor={editor}>
          {children}
        </SlateComment>
      );
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
