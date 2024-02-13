/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import ConceptList from "./ConceptList";
import { TYPE_CONCEPT_LIST } from "./types";

export const conceptListRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_CONCEPT_LIST) {
      return (
        <ConceptList attributes={attributes} element={element} editor={editor}>
          {children}
        </ConceptList>
      );
    } else return renderElement?.({ attributes, children, element });
  };

  return editor;
};
