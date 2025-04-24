/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import BlockWrapper from "./BlockWrapper";
import { CONCEPT_BLOCK_ELEMENT_TYPE } from "./types";

export const blockConceptRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === CONCEPT_BLOCK_ELEMENT_TYPE) {
      return (
        <BlockWrapper attributes={attributes} element={element} editor={editor}>
          {children}
        </BlockWrapper>
      );
    } else return renderElement?.({ attributes, element, children });
  };

  return editor;
};
