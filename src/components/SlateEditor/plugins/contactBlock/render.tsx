/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import SlateContactBlock from "./SlateContactBlock";
import { CONTACT_BLOCK_ELEMENT_TYPE } from "./types";

export const contactBlockRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === CONTACT_BLOCK_ELEMENT_TYPE) {
      return (
        <SlateContactBlock editor={editor} element={element} attributes={attributes}>
          {children}
        </SlateContactBlock>
      );
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
