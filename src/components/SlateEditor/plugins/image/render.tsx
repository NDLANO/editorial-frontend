/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import SlateImage from "./SlateImage";
import { IMAGE_ELEMENT_TYPE } from "./types";

export const imageRenderer = (allowDecorative: boolean) => (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === IMAGE_ELEMENT_TYPE) {
      return (
        <SlateImage attributes={attributes} editor={editor} element={element} allowDecorative={allowDecorative}>
          {children}
        </SlateImage>
      );
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};
