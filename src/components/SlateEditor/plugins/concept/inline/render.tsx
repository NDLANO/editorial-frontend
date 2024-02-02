/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import InlineConcept from "./InlineWrapper";
import { TYPE_CONCEPT_INLINE } from "./types";

export const inlineConceptRenderer = (locale: string) => (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_CONCEPT_INLINE) {
      return (
        <InlineConcept element={element} attributes={attributes} editor={editor} locale={locale}>
          {children}
        </InlineConcept>
      );
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};
