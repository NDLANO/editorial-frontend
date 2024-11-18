/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isKeyHotkey, isCodeHotkey } from "is-hotkey";
import { Editor } from "slate";
import { handleClickBlock, handleClickInline, handleClickText } from "./handleMenuClicks";
import SlateToolbar from "./SlateToolbar";
import {
  AreaFilters,
  CategoryFilters,
  ToolbarAction,
  createToolbarAreaOptions,
  createToolbarDefaultValues,
  getEditorAncestors,
  toolbarState,
} from "./toolbarState";
import { toggleMark } from "../mark/utils";

const isBoldHotkey = isKeyHotkey("mod+b");
const isCodeHotKey = isKeyHotkey("mod+k");
const isConceptHotKey = isCodeHotkey("mod+alt+c");
const isGlossHotKey = isCodeHotkey("mod+alt+g");
const isCommentHotKey = isCodeHotkey("mod+alt+e");
const isH2HotKey = isKeyHotkey("mod+2");
const isH3HotKey = isKeyHotkey("mod+3");
const isH4HotKey = isKeyHotkey("mod+4");
const isItalicHotKey = isKeyHotkey("mod+i");
const isLetteredListHotKey = isCodeHotkey("mod+alt+a");
const isLinkHotKey = isCodeHotkey("mod+alt+l");
const isListHotKey = isKeyHotkey("mod+l");
const isMathHotKey = isKeyHotkey("mod+m");
const isNumberedListHotKey = isCodeHotkey("mod+alt+1");
const isDefinitionListHotkey = isCodeHotkey("mod+alt+d");
const isQuoteHotKey = isCodeHotkey("mod+alt+b");
const isSubHotKey = isCodeHotkey("mod+alt+s");
const isSupHotKey = isCodeHotkey("mod+alt+h");

const toolbarPlugin =
  (options: CategoryFilters = createToolbarDefaultValues(), areaOptions: AreaFilters = createToolbarAreaOptions()) =>
  (editor: Editor) => {
    const { onKeyDown: nextOnKeyDown, shouldShowToolbar } = editor;

    editor.shouldShowToolbar = () => {
      if (shouldShowToolbar) {
        return shouldShowToolbar();
      } else {
        return true;
      }
    };

    editor.onKeyDown = (e: KeyboardEvent) => {
      let action: ToolbarAction | undefined;

      if (!e.metaKey && !e.ctrlKey) {
        nextOnKeyDown?.(e);
        return;
      }
      if (isBoldHotkey(e)) {
        action = { category: "mark", value: "bold" };
      } else if (isCodeHotKey(e)) {
        action = { category: "mark", value: "code" };
      } else if (isConceptHotKey(e)) {
        action = { category: "inline", value: "concept-inline" };
      } else if (isGlossHotKey(e)) {
        action = { category: "inline", value: "gloss-inline" };
      } else if (isCommentHotKey(e)) {
        action = { category: "inline", value: "comment-inline" };
      } else if (isH2HotKey(e)) {
        action = { category: "text", value: "heading-2" };
      } else if (isH3HotKey(e)) {
        action = { category: "text", value: "heading-3" };
      } else if (isH4HotKey(e)) {
        action = { category: "text", value: "heading-4" };
      } else if (isItalicHotKey(e)) {
        action = { category: "mark", value: "italic" };
      } else if (isLetteredListHotKey(e)) {
        action = { category: "block", value: "letter-list" };
      } else if (isLinkHotKey(e)) {
        action = { category: "inline", value: "content-link" };
      } else if (isListHotKey(e)) {
        action = { category: "block", value: "bulleted-list" };
      } else if (isMathHotKey(e)) {
        action = { category: "inline", value: "mathml" };
      } else if (isNumberedListHotKey(e)) {
        action = { category: "block", value: "numbered-list" };
      } else if (isQuoteHotKey(e)) {
        action = { category: "block", value: "quote" };
      } else if (isSubHotKey(e)) {
        action = { category: "mark", value: "sub" };
      } else if (isSupHotKey(e)) {
        action = { category: "mark", value: "sup" };
      } else if (isDefinitionListHotkey(e)) {
        action = { category: "block", value: "definition-list" };
      }

      if (!action || !editor.shouldShowToolbar()) {
        nextOnKeyDown?.(e);
        return;
      }

      const state = toolbarState({
        editorAncestors: getEditorAncestors(editor),
        options,
        areaOptions,
      });

      const option = state[action.category].find((el) => el.value === action?.value);

      if (!option || option.disabled || option.hidden) {
        nextOnKeyDown?.(e);
        return;
      }

      e.preventDefault();

      if (action.category === "mark") {
        toggleMark(e, editor, action.value);
      } else if (action.category === "block") {
        handleClickBlock(e, editor, action.value);
      } else if (action.category === "inline") {
        handleClickInline(e, editor, action.value);
      } else if (action.category === "text") {
        handleClickText(e, editor, action.value);
      } else if (nextOnKeyDown) {
        nextOnKeyDown(e);
      }
    };
    return editor;
  };

export { SlateToolbar, toolbarPlugin };
