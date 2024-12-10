/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Text, Editor, Element, Transforms, Range, Node, Path } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_HEADING } from "./types";
import { createHtmlTag } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import hasNodeOfType from "../../utils/hasNodeOfType";
import { KEY_BACKSPACE, KEY_ENTER } from "../../utils/keys";
import { CustomTextWithMarks } from "../mark";
import { TYPE_PARAGRAPH } from "../paragraph/types";
import { TYPE_SPAN } from "../span/types";

export interface HeadingElement {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: Descendant[];
}

export const headingSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    const tag = el.tagName.toLowerCase();
    if (tag === "h1") {
      return slatejsx("element", { type: TYPE_HEADING, level: 2 }, children);
    }
    if (tag === "h2") {
      return slatejsx("element", { type: TYPE_HEADING, level: 2 }, children);
    }
    if (tag === "h3") {
      return slatejsx("element", { type: TYPE_HEADING, level: 3 }, children);
    }
    if (tag === "h4") {
      return slatejsx("element", { type: TYPE_HEADING, level: 4 }, children);
    }
    if (tag === "h5") {
      return slatejsx("element", { type: TYPE_HEADING, level: 4 }, children);
    }
    if (tag === "h6") {
      return slatejsx("element", { type: TYPE_HEADING, level: 4 }, children);
    }
  },
  serialize(node, children) {
    if (!Element.isElement(node)) return;
    if (node.type === TYPE_HEADING) {
      return createHtmlTag({ tag: `h${node.level}`, children });
    }
  },
};

const onEnter = (e: KeyboardEvent, editor: Editor, nextOnKeyDown?: (event: KeyboardEvent) => void) => {
  if (!Range.isRange(editor.selection) || !editor.selection) return nextOnKeyDown?.(e);
  const [entry] = Editor.nodes<HeadingElement>(editor, {
    match: (node) => Element.isElement(node) && node.type === TYPE_HEADING,
    at: editor.selection,
  });

  if (!entry) return nextOnKeyDown?.(e);

  const [, currentHeadingPath] = entry;
  e.preventDefault();

  if (
    !Editor.isEnd(editor, editor.selection.anchor, currentHeadingPath) &&
    !Editor.isStart(editor, editor.selection.anchor, currentHeadingPath)
  ) {
    Transforms.splitNodes(editor, {
      match: (node) => Element.isElement(node) && node.type === TYPE_HEADING,
      at: editor.selection,
    });
    return;
  }

  if (Editor.isStart(editor, editor.selection.anchor, currentHeadingPath)) {
    return Transforms.insertNodes(editor, slatejsx("element", { type: TYPE_PARAGRAPH }, [{ text: "" }]), {
      at: editor.selection,
    });
  }

  return Transforms.insertNodes(editor, slatejsx("element", { type: TYPE_PARAGRAPH }, [{ text: "" }]));
};

const onBackspace = (e: KeyboardEvent, editor: Editor, nextOnKeyDown?: (event: KeyboardEvent) => void) => {
  if (hasNodeOfType(editor, TYPE_HEADING)) {
    if (Range.isRange(editor.selection)) {
      if (e.ctrlKey) {
        e.preventDefault();
        editor.deleteBackward("word");
        // Replace heading with paragraph if last character is removed
        if (hasNodeOfType(editor, "heading") && Editor.string(editor, editor.selection.anchor.path) === "") {
          Transforms.unwrapNodes(editor, {
            match: (node) => Element.isElement(node) && node.type === "heading",
          });
          return;
        }
      }
      // Replace heading with paragraph if last character is removed
      if (
        Range.isCollapsed(editor.selection) &&
        Editor.string(editor, editor.selection.anchor.path).length === 1 &&
        editor.selection.anchor.offset === 1
      ) {
        e.preventDefault();
        editor.deleteBackward("character");
        Transforms.unwrapNodes(editor, {
          match: (node) => Element.isElement(node) && node.type === TYPE_HEADING,
        });
        return;
      }
    }
  }
  return nextOnKeyDown && nextOnKeyDown(e);
};

const isBoldText = (node: Descendant): node is CustomTextWithMarks & { bold: boolean } =>
  Text.isText(node) && (node?.bold ?? false);
const isBoldSpanChild = (node: Descendant): node is Element =>
  Element.isElement(node) && node.type === TYPE_SPAN && node.children.some((spanChild) => isBoldText(spanChild));

const unboldTextNode = (editor: Editor, node: Text, path: Path) => {
  Transforms.setNodes(editor, { ...node, bold: undefined }, { at: path });
};

export const headingPlugin = (editor: Editor) => {
  const { normalizeNode: nextNormalizeNode, onKeyDown: nextOnKeyDown } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === TYPE_HEADING) {
      // Remove bold mark on heading text and span children
      if (node.children.some((child) => isBoldText(child) || isBoldSpanChild(child))) {
        Editor.withoutNormalizing(editor, () => {
          node.children.forEach((child, idx) => {
            if (isBoldText(child)) {
              unboldTextNode(editor, child, path.concat(idx));
            } else if (isBoldSpanChild(child)) {
              child.children.forEach((spanChild, spanIdx) => {
                if (isBoldText(spanChild)) {
                  unboldTextNode(editor, spanChild, path.concat(idx, spanIdx));
                }
              });
            }
          });
        });
        return;
      }

      // Remove empty headers, but not when cursor is placed inside it.
      if (
        Node.string(node) === "" &&
        (!Range.isRange(editor.selection) ||
          (Range.isRange(editor.selection) &&
            Range.isCollapsed(editor.selection) &&
            !Path.isCommon(path, editor.selection.anchor.path)))
      ) {
        Transforms.unwrapNodes(editor, { at: path });
        return;
      }
    }

    nextNormalizeNode(entry);
  };

  editor.onKeyDown = (e: KeyboardEvent) => {
    if (e.key === KEY_ENTER) {
      onEnter(e, editor, nextOnKeyDown);
    } else if (e.key === KEY_BACKSPACE) {
      onBackspace(e, editor, nextOnKeyDown);
    } else if (nextOnKeyDown) {
      nextOnKeyDown(e);
    }
  };

  return editor;
};
