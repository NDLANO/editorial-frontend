/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { DragEventHandler } from "react";
import { Editor, Element, Path, Transforms } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";
import { getTopNode } from "./utils";

const onDrop =
  (editor: Editor): DragEventHandler<HTMLDivElement> =>
  (event) => {
    const data = event.dataTransfer;
    if (data.getData("application/x-slate-fragment")) {
      // Prevent slate from merging current event with the previous by inserting an empty undo.
      // Reason: Undo after drag and drop causes both drag and previous action to be undone.
      editor.history.undos.push({ operations: [], selectionBefore: null });
    }
    const originPath = JSON.parse(data.getData("application/slate-node-path") || "[]");

    if (Array.isArray(originPath) && originPath.length > 0) {
      event.preventDefault();
      event.stopPropagation();
      const targetNode = ReactEditor.toSlateNode(editor, event.target as Node);
      const targetPath = ReactEditor.findPath(editor, targetNode);
      const topLevelTargetEntry = getTopNode(editor, targetPath);
      if (!topLevelTargetEntry) {
        return;
      }
      const [topLevelTargetNode, topLevelTargetPath] = topLevelTargetEntry;

      if (
        Path.equals(originPath, targetPath) ||
        Path.isDescendant(targetPath, originPath) ||
        Path.equals(originPath, topLevelTargetPath)
      ) {
        return;
      }

      // Handle case where root section is detected as the target.
      if (Element.isElement(topLevelTargetNode) && topLevelTargetNode.type === "section") {
        // We need to manually calculate the correct posistion to move the node
        // @ts-expect-error EventTarget interface does not include children attribute, but the property does exist on target in this case.
        const children = event.target.children as HTMLCollection;
        let prevElementTop = 0;
        let insertAtNode;
        for (let i = 0; i < children.length; i++) {
          const elementTop = children[i].getBoundingClientRect().top;
          if (elementTop > event.clientY) {
            // check if it should be inserted before or after this element
            const elementOvershoot = event.clientY - prevElementTop;
            const goUp = elementOvershoot > (elementTop - prevElementTop) / 2;
            if (goUp && children.length > i + 1) {
              insertAtNode = children[i + 1];
            }
            insertAtNode = children[i];
            break;
          }
          prevElementTop = elementTop;
        }

        if (!insertAtNode) {
          return;
        }
        const insertBeforeNode = ReactEditor.findPath(editor, ReactEditor.toSlateNode(editor, insertAtNode));
        if (Path.equals(insertBeforeNode, originPath)) {
          return;
        }

        HistoryEditor.withoutMerging(editor, () => {
          Transforms.moveNodes(editor, {
            at: originPath,
            to: insertBeforeNode,
          });
        });
      } else {
        if (Path.equals(originPath, topLevelTargetPath) || Path.isDescendant(topLevelTargetPath, originPath)) {
          return;
        }
        const { height, top } = (event.target as HTMLDivElement).getBoundingClientRect();

        const goUp = top + height / 2 > event.clientY || !Editor.hasPath(editor, Path.next(topLevelTargetPath));

        HistoryEditor.withoutMerging(editor, () => {
          Transforms.moveNodes(editor, {
            at: originPath,
            to: goUp ? topLevelTargetPath : Path.next(topLevelTargetPath),
          });
        });
      }
      if (!ReactEditor.isFocused(editor)) {
        ReactEditor.focus(editor);
      }
    }
  };

export default onDrop;
