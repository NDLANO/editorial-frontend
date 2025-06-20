/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import Footnote from "./Footnote";
import { FOOTNOTE_ELEMENT_TYPE } from "./types";

export const footnoteRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ element, attributes, children }) => {
    if (element.type === FOOTNOTE_ELEMENT_TYPE) {
      return (
        <Footnote element={element} attributes={attributes} editor={editor}>
          {children}
        </Footnote>
      );
    } else return renderElement?.({ element, attributes, children });
  };

  return editor;
};
