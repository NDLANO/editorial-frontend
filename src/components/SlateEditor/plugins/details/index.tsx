/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Element, Descendant, Editor, Transforms, Node, Range, Location } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_DETAILS, TYPE_SUMMARY } from "./types";
import { SlateSerializer } from "../../interfaces";
import containsVoid from "../../utils/containsVoid";
import { NormalizerConfig } from "../../utils/defaultNormalizer";
import getCurrentBlock from "../../utils/getCurrentBlock";
import { KEY_BACKSPACE, KEY_ENTER } from "../../utils/keys";
import {
  afterOrBeforeTextBlockElement,
  lastTextBlockElement,
  textBlockElements,
} from "../../utils/normalizationHelpers";
import { TYPE_PARAGRAPH } from "../paragraph/types";
import { KeyDown, createPlugin } from "../PluginFactory";
import { TYPE_SPAN } from "../span/types";

export interface DetailsElement {
  type: "details";
  children: Descendant[];
}

export interface SummaryElement {
  type: "summary";
  children: Descendant[];
}

const detailsNormalizerConfig: NormalizerConfig = {
  firstNode: {
    allowed: [TYPE_SUMMARY],
    defaultType: TYPE_SUMMARY,
  },
  nodes: {
    allowed: textBlockElements,
    defaultType: TYPE_PARAGRAPH,
  },
  lastNode: {
    allowed: lastTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
  previous: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
  next: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
};

const summaryNormalizerConfig: NormalizerConfig = {
  parent: {
    allowed: [TYPE_DETAILS],
    defaultType: TYPE_PARAGRAPH,
  },
};

const onEnter: KeyDown<SummaryElement["type"]> = (e, editor) => {
  e.preventDefault();
  Transforms.splitNodes(editor, {
    match: (node) => Element.isElement(node) && node.type === TYPE_SUMMARY,
    always: true,
  });
  return true;
};

const onBackspace: KeyDown<DetailsElement["type"]> = (e, editor, entry) => {
  if (Location.isLocation(editor.selection) && Range.isCollapsed(editor.selection)) {
    const [detailsNode, detailsPath] = entry;
    if (detailsNode) {
      const summaryEntry = getCurrentBlock(editor, TYPE_SUMMARY);

      if (summaryEntry?.length) {
        const [summaryNode] = summaryEntry;
        if (Node.string(detailsNode).length > 0 && Node.string(summaryNode) === "") {
          e.preventDefault();
          Transforms.move(editor, { reverse: true });
          return true;
        }
      } else if (
        Node.string(detailsNode) === "" &&
        !containsVoid(editor, detailsNode) &&
        detailsNode.children.length === 2
      ) {
        e.preventDefault();
        Transforms.removeNodes(editor, { at: detailsPath });
        return true;
      }
    }
  }
  return false;
};

export const detailsSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() === "summary") {
      const childs =
        !Element.isElement(children?.[0]) || children?.[0].type === TYPE_SPAN
          ? slatejsx("element", { type: TYPE_PARAGRAPH, serializeAsText: true }, children)
          : children;
      return slatejsx("element", { type: TYPE_SUMMARY }, childs);
    } else if (el.tagName.toLowerCase() === "details") {
      return slatejsx("element", { type: TYPE_DETAILS }, children);
    }
    return;
  },
  serialize(node: Descendant, children: JSX.Element[]) {
    if (!Element.isElement(node)) return;
    if (node.type === TYPE_SUMMARY) {
      return <summary>{children}</summary>;
    } else if (node.type === TYPE_DETAILS) {
      return <details>{children}</details>;
    }
  },
};

export const detailsPlugin = createPlugin<DetailsElement["type"]>({
  type: TYPE_DETAILS,
  normalizeWithConfig: detailsNormalizerConfig,
  onKeyDown: {
    [KEY_BACKSPACE]: onBackspace,
  },
  childPlugins: [
    {
      type: TYPE_SUMMARY,
      shouldHideBlockPicker: (editor) => {
        const [summaryEntry] = Editor.nodes<SummaryElement>(editor, {
          match: (node) => Element.isElement(node) && node.type === TYPE_SUMMARY,
        });
        return !!summaryEntry;
      },
      onKeyDown: {
        [KEY_ENTER]: onEnter,
      },
      normalizeWithConfig: summaryNormalizerConfig,
      normalizeMethods: [
        {
          description: "Assure that paragraphs should serialize as plaintext",
          normalize: ([node, path], editor) => {
            if (
              node.children?.[0] &&
              Element.isElement(node.children?.[0]) &&
              node.children?.[0].type === TYPE_PARAGRAPH
            ) {
              Transforms.setNodes(editor, { type: TYPE_PARAGRAPH, serializeAsText: true }, { at: [...path, 0] });
              return true;
            }
            return false;
          },
        },
      ],
    },
  ],
});
