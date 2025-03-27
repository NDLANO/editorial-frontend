/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import SlateKeyFigure from "./SlateKeyFigure";
import { KEY_FIGURE_ELEMENT_TYPE } from "./types";

export const keyFigureRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === KEY_FIGURE_ELEMENT_TYPE) {
      return (
        <SlateKeyFigure element={element} editor={editor} attributes={attributes}>
          {children}
        </SlateKeyFigure>
      );
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
