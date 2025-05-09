/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import { SlateExternal } from "./SlateExternal";
import { EXTERNAL_ELEMENT_TYPE, IFRAME_ELEMENT_TYPE } from "./types";

export const externalRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === EXTERNAL_ELEMENT_TYPE || element.type === IFRAME_ELEMENT_TYPE) {
      return (
        <SlateExternal attributes={attributes} editor={editor} element={element}>
          {children}
        </SlateExternal>
      );
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};
