/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent } from "react";
import { Editor, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import RelatedArticleBox from "./RelatedArticleBox";

export const relatedRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === "related") {
      return (
        <RelatedArticleBox
          attributes={attributes}
          element={element}
          editor={editor}
          onRemoveClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            e.preventDefault();
            const path = ReactEditor.findPath(editor, element);
            ReactEditor.focus(editor);
            Transforms.select(editor, path);
            Transforms.removeNodes(editor, { at: path });
          }}
        >
          {children}
        </RelatedArticleBox>
      );
    }
    return renderElement?.({ attributes, children, element });
  };
  return editor;
};
