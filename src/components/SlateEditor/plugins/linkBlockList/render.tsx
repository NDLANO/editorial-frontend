/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import SlateLinkBlockList from "./SlateLinkBlockList";
import { LINK_BLOCK_LIST_ELEMENT_TYPE } from "./types";

export const linkBlockListRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === LINK_BLOCK_LIST_ELEMENT_TYPE) {
      return (
        <SlateLinkBlockList attributes={attributes} element={element} editor={editor}>
          {children}
        </SlateLinkBlockList>
      );
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
