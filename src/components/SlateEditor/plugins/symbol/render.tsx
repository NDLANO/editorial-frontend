/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import { SlateSymbol } from "./SlateSymbol";
import { SYMBOL_ELEMENT_TYPE } from "./types";

export const symbolRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ element, attributes, children }) => {
    if (element.type === SYMBOL_ELEMENT_TYPE) {
      return (
        <SlateSymbol editor={editor} element={element} attributes={attributes}>
          {children}
        </SlateSymbol>
      );
    } else {
      return renderElement?.({ element, attributes, children });
    }
  };

  return editor;
};
