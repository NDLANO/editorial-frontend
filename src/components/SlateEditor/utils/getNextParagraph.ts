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
import { TYPE_FRAMED_CONTENT } from "../plugins/framedContent/types";
import { TYPE_GRID } from "../plugins/grid/types";
import { TYPE_PARAGRAPH } from "../plugins/paragraph/types";
import { TYPE_TABLE } from "../plugins/table/types";
import { TYPE_DISCLAIMER } from "../plugins/uuDisclaimer/types";

export const manualTypes = [TYPE_DISCLAIMER, TYPE_FRAMED_CONTENT, TYPE_GRID, TYPE_TABLE];

export const getNextParagraph = (editor: Editor, nextNode: Node) => {
  const path: Path = ReactEditor.findPath(editor, nextNode);
  const [block] = getCurrentBlock(editor, TYPE_PARAGRAPH, path) || [];
  return block;
};

export default getNextParagraph;
