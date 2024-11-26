/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Editor, Element, Node, Range, Transforms } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { MathmlElement } from ".";
import { TYPE_MATHML } from "./types";
import getCurrentBlock from "../../utils/getCurrentBlock";
import hasNodeOfType from "../../utils/hasNodeOfType";

export const isMathml = (node: Node | undefined): node is MathmlElement => {
  return Element.isElement(node) && node.type === TYPE_MATHML;
};

export const insertMathml = (editor: Editor) => {
  const { selection } = editor;
  if (!Range.isRange(selection)) return;

  if (hasNodeOfType(editor, "mathml")) {
    Transforms.unwrapNodes(editor, {
      match: (node) => Element.isElement(node) && node.type === "mathml",
      voids: true,
    });
    return;
  }

  if (Range.isCollapsed(selection)) {
    Transforms.insertNodes(
      editor,
      slatejsx("element", { type: "mathml", data: {}, isFirstEdit: true }, [{ text: "" }]),
      {
        at: Editor.unhangRange(editor, selection),
      },
    );
  } else {
    Transforms.wrapNodes(editor, slatejsx("element", { type: "mathml", data: {}, isFirstEdit: true }, [{ text: "" }]), {
      at: Editor.unhangRange(editor, selection),
      split: true,
    });
  }
};

export const onArrowUp = (
  e: KeyboardEvent,
  editor: Editor,
  onKeyDown: ((event: KeyboardEvent) => void) | undefined,
) => {
  if (!editor.selection || !Range.isCollapsed(editor.selection)) {
    return onKeyDown?.(e);
  }

  const mathml = getCurrentBlock(editor, TYPE_MATHML)?.[0];

  if (isMathml(mathml)) {
    e.preventDefault();
    Transforms.move(editor, { unit: "line", reverse: true });
    return;
  }
  onKeyDown?.(e);
};

export const onArrowDown = (
  e: KeyboardEvent,
  editor: Editor,
  onKeyDown: ((event: KeyboardEvent) => void) | undefined,
) => {
  if (!editor.selection || !Range.isCollapsed(editor.selection)) {
    return onKeyDown?.(e);
  }

  const mathml = getCurrentBlock(editor, TYPE_MATHML)?.[0];

  if (isMathml(mathml)) {
    e.preventDefault();
    Transforms.move(editor, { unit: "line" });
    return;
  }
  onKeyDown?.(e);
};
