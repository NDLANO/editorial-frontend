/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element, Path, Transforms } from "slate";
import { DragEndEvent } from "@dnd-kit/core";
import { DndPluginOptions } from "./dndTypes";

export const onDragEnd = (dragEvent: DragEndEvent, editor: Editor, dndOptions: DndPluginOptions | undefined) => {
  const overElement = dragEvent.over?.data.current?.element;
  const activeElement = dragEvent.active.data.current?.element;
  const overId = overElement?.id;
  const activeId = dragEvent.active.id;
  const dropAreaPosition = dragEvent.over?.data.current?.position;
  if (!(dropAreaPosition === "top" || dropAreaPosition === "bottom")) return;

  const [entry1, entry2] = editor.nodes({
    match: (n) => Element.isElement(n) && (n.id === activeId || n.id === overId),
    mode: "all",
    at: [],
  });

  if (!entry1 || !("id" in entry1[0]) || !entry2) {
    return;
  }

  const [, overPath] = entry1[0].id === overId ? entry1 : entry2;
  const [, activePath] = entry1[0].id === activeId ? entry1 : entry2;

  const [parent] = editor.parent(overPath);

  const legalChildren = Element.isElement(parent) && dndOptions?.legalChildren?.[parent.type];

  if (legalChildren && activeElement && !legalChildren.includes(activeElement.type)) return;

  let targetPath = overPath;
  if (dropAreaPosition === "top") {
    targetPath = overPath;
  } else if (dropAreaPosition === "bottom") {
    // For some reason, the bottom drop area has a bunch of edge cases. Why? I have no idea.

    // if the active element is the last child of the parent, we need to move it out of the parent and into the parent sibling
    if (Path.isParent(overPath, activePath) && editor.node(overPath).length === activePath[activePath.length - 1]) {
      targetPath = Path.next(overPath);
    }
    // When moving backwards, we need to move the element an additional space.
    else if (Path.isBefore(overPath, activePath) || overPath.length > activePath.length) {
      targetPath = Path.next(overPath);
    }
    // Element is moved from one container to another.
    else if (overPath.length === activePath.length && !Path.equals(overPath.slice(0, -1), activePath.slice(0, -1))) {
      targetPath = Path.next(overPath);
    }
    // this path handles moving an element out of a container into a parent sibling. For instance moving a grid paragraph directly after the grid.
    else if (activePath.length > overPath.length) {
      targetPath = Path.next(overPath);
    } else {
      targetPath = overPath;
    }
  }
  if (Path.equals(activePath, targetPath) || Path.isAncestor(activePath, targetPath)) return;
  setTimeout(() => {
    Transforms.moveNodes(editor, { at: activePath, to: targetPath });
    // in case the move operation puts the editor in an invalid state
    Editor.normalize(editor, { force: true });
  }, 0);
};
