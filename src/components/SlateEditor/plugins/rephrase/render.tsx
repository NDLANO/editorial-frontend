/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import { InlineBugfix } from "../../utils/InlineBugFix";
import { Rephrase } from "./Rephrase";
import { REPHRASE_ELEMENT_TYPE } from "./rephraseTypes";

export const rephraseRenderer = (editor: Editor) => {
  const { renderElement } = editor;

  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === REPHRASE_ELEMENT_TYPE) {
      return (
        <Rephrase element={element} attributes={attributes} editor={editor}>
          <InlineBugfix />
          {children}
          <InlineBugfix />
        </Rephrase>
      );
    } else {
      return renderElement?.({ attributes, children, element });
    }
  };
  return editor;
};
