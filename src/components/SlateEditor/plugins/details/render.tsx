/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Path, Element, Node } from "slate";
import { ReactEditor, RenderLeafProps } from "slate-react";
import { ExpandableBoxSummary } from "@ndla/primitives";
import Details from "./Details";
import { TYPE_DETAILS, TYPE_SUMMARY } from "./types";
import WithPlaceHolder from "../../common/WithPlaceHolder";

export const detailsRenderer = (editor: Editor) => {
  const { renderElement, renderLeaf } = editor;
  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_SUMMARY) {
      return (
        <ExpandableBoxSummary {...attributes} asChild consumeCss>
          <div>{children}</div>
        </ExpandableBoxSummary>
      );
    } else if (element.type === TYPE_DETAILS) {
      return (
        <Details attributes={attributes} editor={editor} element={element}>
          {children}
        </Details>
      );
    } else return renderElement?.({ attributes, children, element });
  };

  editor.renderLeaf = (props: RenderLeafProps) => {
    const { attributes, children, text } = props;
    const path = ReactEditor.findPath(editor, text);

    const [parent] = Editor.node(editor, Path.parent(Path.parent(path)));
    if (Element.isElement(parent) && parent.type === TYPE_SUMMARY && Node.string(parent) === "") {
      return (
        <WithPlaceHolder attributes={attributes} placeholder="form.name.title">
          {children}
        </WithPlaceHolder>
      );
    }
    return renderLeaf?.(props);
  };

  return editor;
};
