/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import { InlineBugfix } from "../../../utils/InlineBugFix";
import InlineConcept from "./InlineWrapper";
import { CONCEPT_INLINE_ELEMENT_TYPE } from "./types";

export const inlineConceptRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === CONCEPT_INLINE_ELEMENT_TYPE) {
      return (
        <InlineConcept element={element} attributes={attributes} editor={editor}>
          <InlineBugfix />
          {children}
          <InlineBugfix />
        </InlineConcept>
      );
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};
