/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DragEvent, DragEventHandler } from "react";
import { Editor, Element, Node, ElementEntry, Transforms, Path } from "slate";
import { ReactEditor } from "slate-react";
import { DND_PLUGIN, DndPluginOptions } from "./dndTypes";
import { SECTION_ELEMENT_TYPE } from "@ndla/editor";

export const nativeOnDragStart = (editor: Editor, event: DragEvent<HTMLDivElement>) => {
  event.dataTransfer.effectAllowed = "copy";

  const node = ReactEditor.toSlateNode(editor, event.target as globalThis.Node);
  // We only want to alter element dragging, not text nodes
  if (!Element.isElement(node)) return;

  const path = ReactEditor.findPath(editor, node);
  const dndOptions = editor.getPluginOptions<DndPluginOptions>(DND_PLUGIN);

  if (dndOptions && !dndOptions.disabledElements?.includes(node.type)) {
    event.dataTransfer.setData("application/x-slate-data", JSON.stringify([node, path]));
  }
};

export const nativeOnDragOver: DragEventHandler<HTMLDivElement> = (e) => e.preventDefault();

export const nativeOnDrop = (editor: Editor, event: DragEvent<HTMLDivElement>) => {
  try {
    const data = event.dataTransfer.getData("application/x-slate-data");
    // We're dropping a text node, so we don't need to handle it
    if (!data) return;
    event.preventDefault();

    const logger = editor.logger.getLogger("native-dnd");
    const [node, path] = JSON.parse(data) as ElementEntry;
    let targetNode: Node | undefined = ReactEditor.toSlateNode(editor, event.target as globalThis.Node);
    let targetPath: Path | undefined = ReactEditor.findPath(editor, targetNode);

    // If the target is text we need to find the closest parent element
    if (!Element.isElement(targetNode)) {
      const [el, elPath] =
        editor.above({
          at: targetPath,
          match: (n) => Element.isElement(n) && n.type !== SECTION_ELEMENT_TYPE,
        }) ?? [];
      targetNode = el;
      targetPath = elPath;
    }

    if (!Element.isElement(targetNode) || !targetPath) {
      logger.log("Failed to resolve target node for drop");
      return;
    }

    // We've already asserted that this exists in nativeOnDragStart
    const dndOptions = editor.getPluginOptions<DndPluginOptions>(DND_PLUGIN)!;
    const [parentNode] = editor.above({ at: targetPath, match: Element.isElement }) ?? [];

    if (!Element.isElement(parentNode)) {
      logger.log("Parent node is not an element");
      return;
    }
    const legalChildren = dndOptions.legalChildren?.[parentNode.type];
    if (legalChildren && !legalChildren.length) {
      logger.log("No legal children defined for parent node", parentNode.type);
      return;
    }
    if (legalChildren && !legalChildren?.includes(node.type)) {
      logger.log("Node type is not allowed as a child", node.type, "in parent", parentNode.type);
      return;
    }

    Transforms.moveNodes(editor, {
      at: path,
      to: targetPath,
    });
  } catch (e) {
    editor.logger.getLogger("native-dnd").log("Failed to parse drag data", e);
  }
};
