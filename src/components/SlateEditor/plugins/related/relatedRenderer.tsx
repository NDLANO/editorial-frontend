/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor } from "slate";
import RelatedArticleBox from "./RelatedArticleBox";
import { RELATED_ELEMENT_TYPE } from "./types";

export const relatedRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === RELATED_ELEMENT_TYPE) {
      return (
        <RelatedArticleBox attributes={attributes} element={element} editor={editor}>
          {children}
        </RelatedArticleBox>
      );
    }
    return renderElement?.({ attributes, children, element });
  };
  return editor;
};
