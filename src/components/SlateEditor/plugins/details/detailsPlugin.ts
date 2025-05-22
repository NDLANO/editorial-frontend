/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin, defaultNormalizer, Logger, NormalizerConfig, PARAGRAPH_ELEMENT_TYPE } from "@ndla/editor";
import { DETAILS_ELEMENT_TYPE, DETAILS_PLUGIN } from "./detailsTypes";
import { isDetailsElement, isSummaryElement } from "./queries/detailsQueries";
import { SUMMARY_ELEMENT_TYPE } from "./summaryTypes";
import {
  afterOrBeforeTextBlockElement,
  lastTextBlockElement,
  textBlockElements,
} from "../../utils/normalizationHelpers";
import { Editor, Node, Range, Transforms } from "slate";

const normalizerConfig: NormalizerConfig = {
  firstNode: {
    allowed: [SUMMARY_ELEMENT_TYPE],
    defaultType: SUMMARY_ELEMENT_TYPE,
  },
  nodes: {
    allowed: textBlockElements,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
  lastNode: {
    allowed: lastTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
  previous: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
  next: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
};

const onDelete = (editor: Editor, logger: Logger): boolean => {
  if (!editor.selection || !Range.isCollapsed(editor.selection) || editor.selection.anchor.offset) return false;
  const [entry] = editor.nodes({ match: isDetailsElement });
  if (!entry) return false;
  const [node, path] = entry;
  if (Node.string(node) === "" && !editor.hasVoids(node)) {
    logger.log("Delete in empty details element, removing node");
    Transforms.removeNodes(editor, { at: path });
    return true;
  }

  return false;
};

export const detailsPlugin = createPlugin({
  name: DETAILS_PLUGIN,
  type: DETAILS_ELEMENT_TYPE,
  normalize: (editor, node, path, logger) => {
    if (isDetailsElement(node)) {
      if (!isSummaryElement(node.children[0])) {
        logger.log("Details element does not have a summary element as first child, adding one");
        Transforms.insertNodes(
          editor,
          {
            type: SUMMARY_ELEMENT_TYPE,
            children: [{ type: PARAGRAPH_ELEMENT_TYPE, serializeAsText: true, children: [{ text: "" }] }],
          },
          { at: path.concat(0) },
        );
        return true;
      }
      return defaultNormalizer(editor, node, path, normalizerConfig, logger);
    }
    return false;
  },
  transform: (editor, logger) => {
    const { deleteFragment, deleteBackward } = editor;

    editor.deleteBackward = (unit) => {
      const res = onDelete(editor, logger);
      if (res) return;
      deleteBackward(unit);
    };

    editor.deleteFragment = () => {
      const res = onDelete(editor, logger);
      if (res) return;
      deleteFragment();
    };

    return editor;
  },
});
