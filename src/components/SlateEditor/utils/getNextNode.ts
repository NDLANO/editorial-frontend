/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Node, Path } from "slate";
import { ReactEditor } from "slate-react";
import getCurrentBlock from "./getCurrentBlock";
import getNextPath from "./getNextPath";
import getNodeByPath from "./getNodeByPath";
import { TYPE_HEADING } from "../plugins/heading/types";
import { TYPE_PARAGRAPH } from "../plugins/paragraph/types";

const possibleNodes = [TYPE_PARAGRAPH, TYPE_HEADING];

const getNextParagraph = (editor: Editor, node: Node) => {
  const path: Path = ReactEditor.findPath(editor, node);
  const [block] = getCurrentBlock(editor, TYPE_PARAGRAPH, path) || [];
  return block;
};

const getNextNode = (editor: Editor, path: Path, previous?: boolean): Node => {
  let node = undefined;
  let nextPath = getNextPath(path, previous);

  while (!node) {
    let nextNode = getNodeByPath(editor, nextPath);

    if (!nextNode) {
      const workingPath = [...nextPath];
      while (!nextNode) {
        workingPath.pop();
        nextNode = getNodeByPath(editor, getNextPath(workingPath, previous));
      }
      nextPath = getNextPath(workingPath, previous);
    }

    if (!("type" in nextNode) || Editor.isVoid(editor, nextNode)) {
      nextPath = getNextPath(nextPath, previous);
      continue;
    }

    if (possibleNodes.includes(nextNode.type)) {
      node = nextNode;
    }
    node = getNextParagraph(editor, nextNode);
    if (!node) nextPath = getNextPath(nextPath, previous);
  }

  return node;
};

export default getNextNode;
