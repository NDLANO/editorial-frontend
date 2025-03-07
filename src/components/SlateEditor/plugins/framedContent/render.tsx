/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import { FRAMED_CONTENT_ELEMENT_TYPE } from "./framedContentTypes";
import SlateFramedContent from "./SlateFramedContent";

export const framedContentRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === FRAMED_CONTENT_ELEMENT_TYPE) {
      return (
        <SlateFramedContent editor={editor} element={element} attributes={attributes}>
          {children}
        </SlateFramedContent>
      );
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};
