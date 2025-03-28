/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import SlateCommentBlock from "./SlateCommentBlock";
import { COMMENT_BLOCK_ELEMENT_TYPE } from "./types";

export const commentBlockRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === COMMENT_BLOCK_ELEMENT_TYPE) {
      return (
        <SlateCommentBlock attributes={attributes} element={element} editor={editor}>
          {children}
        </SlateCommentBlock>
      );
    } else return renderElement?.({ attributes, element, children });
  };

  return editor;
};
