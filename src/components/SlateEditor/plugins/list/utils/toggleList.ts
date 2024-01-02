/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Editor, Transforms, Element, Range, Path } from "slate";
import { ReactEditor } from "slate-react";
import { defaultListBlock, defaultListItemBlock } from "./defaultBlocks";
import hasListItem from "./hasListItem";
import { isListItemSelected } from "./isListItemSelected";
import { isSelectionOnlyOfType } from "./isSelectionOnlyOfType";
import { firstTextBlockElement } from "../../../utils/normalizationHelpers";
import { TYPE_LIST, TYPE_LIST_ITEM } from "../types";

export const toggleList = (editor: Editor, type: string) => {
  const listType = type ? type : "numbered-list";

  const isIdentical = isSelectionOnlyOfType(editor, listType);

  if (!Range.isRange(editor.selection)) {
    return;
  }

  // If all selected list items are of type input by user, unwrap all of them by lifting them out.
  if (isIdentical) {
    // List normalizer removes empty list blocks afterwards.
    return Transforms.liftNodes(editor, {
      match: (node) => Element.isElement(node) && node.type === TYPE_LIST_ITEM && isListItemSelected(editor, node),
      mode: "all",
    });
    // Selected list items are of mixed type.
  } else if (hasListItem(editor)) {
    // Mark list items for change. The actual change happens in list normalizer.
    Transforms.setNodes(
      editor,
      { changeTo: listType },
      {
        match: (node) => {
          if (!Element.isElement(node) || node.type !== TYPE_LIST_ITEM || !isListItemSelected(editor, node)) {
            return false;
          }
          const [parentNode] = Editor.node(editor, Path.parent(ReactEditor.findPath(editor, node)));

          const shouldChange =
            Element.isElement(parentNode) && parentNode.type === TYPE_LIST && parentNode.listType !== listType;

          return shouldChange;
        },
        mode: "all",
      },
    );
    // No list items are selected
  } else {
    // Wrap all regular text blocks. (paragraph, quote, blockquote)

    const nodes = [
      ...Editor.nodes(editor, {
        match: (node) => Element.isElement(node) && firstTextBlockElement.includes(node.type),
        at: Editor.unhangRange(editor, editor.selection),
      }),
    ];

    // Find the highest level element that should be toggled.
    const targetPathLevel = nodes.reduce<number>((shortestPath, [, path]) => {
      if (
        path.length < shortestPath &&
        !nodes.find(([, childPath]) => {
          return Path.isChild(childPath, path);
        })
      ) {
        return path.length;
      }
      return shortestPath;
    }, Infinity);

    Editor.withoutNormalizing(editor, () => {
      for (const [, path] of nodes) {
        if (path.length !== targetPathLevel) {
          continue;
        }
        Transforms.wrapNodes(editor, defaultListItemBlock(), {
          at: path,
        });
        Transforms.wrapNodes(editor, defaultListBlock(type), {
          at: path,
        });
      }
    });
  }
};
