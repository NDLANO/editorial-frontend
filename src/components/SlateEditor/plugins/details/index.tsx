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
import { createHtmlTag } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import containsVoid from "../../utils/containsVoid";
import { defaultBlockNormalizer, NormalizerConfig } from "../../utils/defaultNormalizer";
import getCurrentBlock from "../../utils/getCurrentBlock";
import hasNodeOfType from "../../utils/hasNodeOfType";
import { KEY_BACKSPACE, KEY_ENTER } from "../../utils/keys";
import {
  afterOrBeforeTextBlockElement,
  lastTextBlockElement,
  textBlockElements,
} from "../../utils/normalizationHelpers";
import { TYPE_PARAGRAPH } from "../paragraph/types";
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

const onEnter = (e: KeyboardEvent, editor: Editor, nextOnKeyDown?: (event: KeyboardEvent) => void) => {
  if (hasNodeOfType(editor, TYPE_SUMMARY)) {
    e.preventDefault();
    Transforms.splitNodes(editor, {
      match: (node) => Element.isElement(node) && node.type === TYPE_SUMMARY,
      always: true,
    });
    return;
  }
  return nextOnKeyDown?.(e);
};

const onBackspace = (e: KeyboardEvent, editor: Editor, nextOnKeyDown?: (event: KeyboardEvent) => void) => {
  if (
    hasNodeOfType(editor, TYPE_DETAILS) &&
    Location.isLocation(editor.selection) &&
    Range.isCollapsed(editor.selection)
  ) {
    const detailsEntry = getCurrentBlock(editor, TYPE_DETAILS);
    if (detailsEntry) {
      const [detailsNode, detailsPath] = detailsEntry;

      if (detailsNode) {
        const summaryEntry = getCurrentBlock(editor, TYPE_SUMMARY);

        if (summaryEntry?.length) {
          const [summaryNode] = summaryEntry;
          if (Node.string(detailsNode).length > 0 && Node.string(summaryNode) === "") {
            e.preventDefault();
            Transforms.move(editor, { reverse: true });
            return;
          }
        }
        if (
          Node.string(detailsNode) === "" &&
          Element.isElement(detailsNode) &&
          !containsVoid(editor, detailsNode) &&
          detailsNode.children.length === 2
        ) {
          e.preventDefault();
          Transforms.removeNodes(editor, { at: detailsPath });
          return;
        }
      }
    }
  }
  return nextOnKeyDown?.(e);
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
  serialize(node, children) {
    if (!Element.isElement(node)) return;
    if (node.type === TYPE_SUMMARY) {
      return createHtmlTag({ tag: "summary", children });
    } else if (node.type === TYPE_DETAILS) {
      return createHtmlTag({ tag: "details", children });
    }
  },
};

export const detailsPlugin = (editor: Editor) => {
  const {
    normalizeNode: nextNormalizeNode,
    shouldHideBlockPicker: nextShouldHideBlockPicker,
    onKeyDown: nextOnKeyDown,
  } = editor;

  editor.onKeyDown = (event) => {
    if (event.key === KEY_ENTER) {
      onEnter(event, editor, nextOnKeyDown);
    } else if (event.key === KEY_BACKSPACE) {
      onBackspace(event, editor, nextOnKeyDown);
    } else if (nextOnKeyDown) {
      nextOnKeyDown(event);
    }
  };

  editor.shouldHideBlockPicker = () => {
    const [summaryEntry] = Editor.nodes(editor, {
      match: (node) => Element.isElement(node) && node.type === TYPE_SUMMARY,
    });
    if (summaryEntry && Element.isElement(summaryEntry[0])) {
      return true;
    }
    return nextShouldHideBlockPicker?.();
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (Element.isElement(node)) {
      if (node.type === TYPE_DETAILS) {
        if (defaultBlockNormalizer(editor, entry, detailsNormalizerConfig)) {
          return;
        }
      }
      if (node.type === TYPE_SUMMARY) {
        if (defaultBlockNormalizer(editor, entry, summaryNormalizerConfig)) {
          return;
        }

        if (node.children?.[0] && Element.isElement(node.children?.[0]) && node.children?.[0].type === TYPE_PARAGRAPH) {
          return Transforms.setNodes(editor, { type: TYPE_PARAGRAPH, serializeAsText: true }, { at: [...path, 0] });
        }
      }
    }

    nextNormalizeNode(entry);
  };
  return editor;
};
