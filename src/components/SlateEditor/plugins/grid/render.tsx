/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import { SlateGrid } from "./SlateGrid";
import SlateGridCell from "./SlateGridCell";
import { GRID_CELL_ELEMENT_TYPE, GRID_ELEMENT_TYPE } from "./types";

export const gridRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === GRID_ELEMENT_TYPE) {
      return (
        <SlateGrid editor={editor} element={element} attributes={attributes}>
          {children}
        </SlateGrid>
      );
    } else if (element.type === GRID_CELL_ELEMENT_TYPE) {
      return (
        <SlateGridCell editor={editor} element={element} attributes={attributes}>
          {children}
        </SlateGridCell>
      );
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};
