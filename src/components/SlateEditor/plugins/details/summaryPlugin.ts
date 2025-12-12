/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createPlugin, defaultNormalizer, isParagraphElement, NormalizerConfig } from "@ndla/editor";
import { SUMMARY_ELEMENT_TYPE, SUMMARY_PLUGIN } from "./summaryTypes";
import { isSummaryElement } from "./queries/detailsQueries";
import { DETAILS_ELEMENT_TYPE } from "./detailsTypes";
import { Path, Transforms } from "slate";

const summaryNormalizerConfig: NormalizerConfig = {
  parent: {
    allowed: [DETAILS_ELEMENT_TYPE],
  },
  // TODO: Consider implementing this!
  // nodes: {
  //   allowed: [PARAGRAPH_ELEMENT_TYPE, HEADING_ELEMENT_TYPE, SPAN_ELEMENT_TYPE],
  //   defaultType: PARAGRAPH_ELEMENT_TYPE,
  // },
};

export const summaryPlugin = createPlugin({
  name: SUMMARY_PLUGIN,
  type: SUMMARY_ELEMENT_TYPE,
  normalize: (editor, node, path, logger) => {
    if (isSummaryElement(node)) {
      const normalized = defaultNormalizer(editor, node, path, summaryNormalizerConfig, logger);
      if (normalized) {
        return true;
      }
      const secondChild = node.children[1];
      if (secondChild) {
        logger.log("Moving extra child out of summary element", node.children);
        Transforms.moveNodes(editor, { at: path.concat(1), to: Path.parent(path).concat(1) });
        return true;
      }
      const firstChild = node.children[0];
      if (isParagraphElement(firstChild) && !firstChild.serializeAsText) {
        logger.log("Setting serializeAsText to true on first element");
        Transforms.setNodes(editor, { serializeAsText: true }, { at: path.concat(0) });
        return true;
      }
    }
    return false;
  },
  transform: (editor, logger) => {
    const { shouldHideBlockPicker } = editor;
    editor.shouldHideBlockPicker = () => {
      const [entry] = editor.nodes({ match: isSummaryElement });
      if (isSummaryElement(entry?.[0])) {
        logger.log("Summary is active, hiding block picker");
        return true;
      }
      return shouldHideBlockPicker?.();
    };

    return editor;
  },
});
