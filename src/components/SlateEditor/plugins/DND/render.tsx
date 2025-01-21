/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Node, Element } from "slate";
import { ReactEditor } from "slate-react";
import DraggableContainer from "./DraggableContainer";
import { TYPE_BREAK } from "../break/types";
import { TYPE_SUMMARY } from "../details/types";
import { TYPE_GRID } from "../grid/types";
import { TYPE_TABLE } from "../table/types";

const ILLEGAL_ELEMENTS = [TYPE_SUMMARY, TYPE_BREAK];
const ILLEGAL_PARENTS = [TYPE_SUMMARY, TYPE_TABLE, TYPE_GRID];

export const draggableElementRenderer = (editor: Editor) => {
  const { renderElement } = editor;

  editor.renderElement = ({ attributes, children, element }) => {
    if (element.id && !editor.isInline(element) && !ILLEGAL_ELEMENTS.includes(element.type)) {
      // TODO: Current way to make sure that element with illegal parents are not rendered as draggable, should be refactored
      const path = ReactEditor.findPath(editor, element);
      const parentsGen = Node.ancestors(editor, path, { reverse: true });
      const elementAncestors = [];
      for (const ancestor of parentsGen) {
        if (Element.isElement(ancestor[0]) && ancestor[0].type !== "section") {
          elementAncestors.push(ancestor[0]);
        }
      }
      const hasIllegalParent = elementAncestors.some((ancestor) => ILLEGAL_PARENTS.includes(ancestor.type));

      return hasIllegalParent ? (
        renderElement?.({ attributes, children, element })
      ) : (
        <DraggableContainer attributes={attributes} elementId={element.id}>
          {renderElement?.({ attributes, children, element })}
        </DraggableContainer>
      );
    } else {
      return renderElement?.({ attributes, children, element });
    }
  };
  return editor;
};
