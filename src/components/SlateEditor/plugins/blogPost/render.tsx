/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import SlateBlogPost from "./SlateBlogPost";
import { TYPE_BLOGPOST } from "./types";

export const blogPostRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_BLOGPOST) {
      return (
        <SlateBlogPost editor={editor} element={element} attributes={attributes}>
          {children}
        </SlateBlogPost>
      );
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
