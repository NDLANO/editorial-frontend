/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import { ASIDE_ELEMENT_TYPE } from "./asideTypes";
import SlateAside from "./SlateAside";

export const asideRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === ASIDE_ELEMENT_TYPE) {
      return (
        <SlateAside editor={editor} element={element} attributes={attributes}>
          {children}
        </SlateAside>
      );
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};
