/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Element, Descendant, Editor, Text, Transforms, Node, Range, Location, Path } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { RenderLeafProps, ReactEditor } from "slate-react";
import { TYPE_DETAILS, TYPE_SUMMARY } from "./types";
import WithPlaceHolder from "../../common/WithPlaceHolder";
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
import { createPlugin } from "../PluginFactory";

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
      return slatejsx("element", { type: TYPE_SUMMARY }, children);
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
  normalizerConfig: detailsNormalizerConfig,
  renderLeaf: ({ attributes, children, text }, editor) => {
    const path = ReactEditor.findPath(editor, text);
    const [parent] = Editor.node(editor, Path.parent(path));
    if (Element.isElement(parent) && parent.type === TYPE_SUMMARY && Node.string(parent) === "") {
      return (
        <WithPlaceHolder attributes={attributes} placeholder="form.name.title">
          {children}
        </WithPlaceHolder>
      );
    }
    return undefined;
  },

  onKeyDown: {
    [KEY_ENTER]: onEnter,
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
      normalizerConfig: summaryNormalizerConfig,
    },
  ],
});
