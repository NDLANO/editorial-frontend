/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import SlateCommentInline from "./SlateCommentInline";
import { COMMENT_INLINE_ELEMENT_TYPE } from "./types";

export const commentInlineRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === COMMENT_INLINE_ELEMENT_TYPE) {
      return (
        <SlateCommentInline element={element} attributes={attributes} editor={editor}>
          {children}
        </SlateCommentInline>
      );
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
