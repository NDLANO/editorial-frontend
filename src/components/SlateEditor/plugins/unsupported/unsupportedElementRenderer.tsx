/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import { UNSUPPORTED_ELEMENT_TYPE } from "./types";
import { UnsupportedElement } from "./UnsupportedElement";

export const unsupportedElementRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = (props) => {
    if (props.element.type === UNSUPPORTED_ELEMENT_TYPE) {
      return <UnsupportedElement {...props} editor={editor} />;
    }
    return renderElement?.(props);
  };
  return editor;
};
