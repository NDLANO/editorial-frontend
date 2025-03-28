/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import SlateH5p from "./SlateH5p";
import { H5P_ELEMENT_TYPE } from "./types";

export const h5pRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === H5P_ELEMENT_TYPE) {
      return (
        <SlateH5p attributes={attributes} editor={editor} element={element}>
          {children}
        </SlateH5p>
      );
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};
