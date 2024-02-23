/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createElement } from "react";
import { Descendant, Editor, Element, Transforms, Range, Node, Path } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_HEADING } from "./types";
import { SlateSerializer } from "../../interfaces";
import hasNodeOfType from "../../utils/hasNodeOfType";
import { KEY_BACKSPACE, KEY_ENTER } from "../../utils/keys";
import { TYPE_PARAGRAPH } from "../paragraph/types";

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
  serialize(node: Descendant, children: JSX.Element[]) {
    if (!Element.isElement(node)) return;
    if (node.type === TYPE_HEADING) {
      return createElement("h" + node.level, [], [children]);
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

  const [currentHeading] = entry;
  e.preventDefault();

  if (editor.selection?.anchor.offset !== Node.string(currentHeading).length && editor.selection?.anchor.offset !== 0) {
    Transforms.splitNodes(editor, {
      match: (node) => Element.isElement(node) && node.type === TYPE_HEADING,
    });
    return;
  }

  if (editor.selection.anchor.offset === 0) {
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

export const headingPlugin = (editor: Editor) => {
  const { normalizeNode: nextNormalizeNode, onKeyDown: nextOnKeyDown } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === TYPE_HEADING) {
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
