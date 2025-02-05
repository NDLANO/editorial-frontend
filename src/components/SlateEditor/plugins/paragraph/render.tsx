/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import { PARAGRAPH_ELEMENT_TYPE } from "@ndla/editor";
import Paragraph from "./Paragraph";

// TODO: This can be replaced
export const paragraphRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === PARAGRAPH_ELEMENT_TYPE) {
      return (
        <Paragraph attributes={attributes} element={element} editor={editor}>
          {children}
        </Paragraph>
      );
    } else return renderElement?.({ attributes, children, element });
  };
  return editor;
};
