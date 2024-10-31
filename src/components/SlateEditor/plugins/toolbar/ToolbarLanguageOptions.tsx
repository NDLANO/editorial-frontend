/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Transforms } from "slate";
import { ReactEditor, useSlate, useSlateSelector } from "slate-react";
import { ToolbarButton } from "@radix-ui/react-toolbar";
import { DropdownItem, DropdownMenu, DropdownTrigger } from "@ndla/dropdown-menu";
import { ArrowDropDown } from "@ndla/icons/common";
import { ToolbarCategoryProps } from "./SlateToolbar";
import UIToolbarButton from "./ToolbarButton";
import { ToolbarDropdownButton, ToolbarDropdownContent } from "./toolbarDropdownComponents";
import { LanguageType } from "./toolbarState";
import hasNodeOfType from "../../utils/hasNodeOfType";
import { defaultSpanBlock } from "../span/utils";

const getCurrentLanguage = (editor: Editor) => {
  const [currentBlock] =
    Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === "span",
      mode: "lowest",
    }) ?? [];
  const node = currentBlock?.[0];
  if (!Element.isElement(node) || node.type !== "span") return;
  return node.data.lang;
};

export const ToolbarLanguageOptions = ({ options }: ToolbarCategoryProps<LanguageType>) => {
  const { t } = useTranslation();
  const editor = useSlate();
  const currentLanguage = useSlateSelector(getCurrentLanguage);

  const onClick = useCallback(
    (language: string) => {
      const sel = editor.selection;
      Transforms.select(editor, sel!);
      ReactEditor.focus(editor);
      const wrappedInSpan = hasNodeOfType(editor, "span");
      if (wrappedInSpan && language === "none") {
        Transforms.unwrapNodes(editor, {
          match: (node) => Element.isElement(node) && node.type === "span",
        });
      } else if (language === "none") {
        return;
      } else if (!wrappedInSpan) {
        Transforms.wrapNodes(editor, defaultSpanBlock({ lang: language }), {
          at: Editor.unhangRange(editor, editor.selection!),
          split: true,
        });
      } else {
        Transforms.unwrapNodes(editor, {
          match: (n) => Element.isElement(n) && n.type === "span",
        });
        Transforms.wrapNodes(editor, defaultSpanBlock({ lang: language }), {
          at: Editor.unhangRange(editor, editor.selection!),
          split: true,
        });
      }
    },
    [editor],
  );

  const onCloseFocus = useCallback(
    (e: Event) => {
      e.preventDefault();
      const sel = editor.selection;
      if (!sel) return;
      setTimeout(() => {
        Transforms.select(editor, sel);
        ReactEditor.focus(editor);
      }, 0);
    },
    [editor],
  );

  const visibleOptions = options.filter((option) => !option.hidden);
  if (!visibleOptions.length) return null;

  return (
    <DropdownMenu modal={false}>
      <ToolbarButton asChild>
        <DropdownTrigger asChild>
          <UIToolbarButton type="language">
            {currentLanguage ? t(`languages.${currentLanguage}`) : t("editorToolbar.noneLanguage")}
            <ArrowDropDown />
          </UIToolbarButton>
        </DropdownTrigger>
      </ToolbarButton>
      <ToolbarDropdownContent side="bottom" onCloseAutoFocus={onCloseFocus} sideOffset={2} portal={false}>
        <DropdownItem>
          <ToolbarDropdownButton
            data-testid={"language-button-none"}
            size="small"
            noTitle
            onClick={() => onClick("none")}
          >
            {t("editorToolbar.noneLanguage")}
          </ToolbarDropdownButton>
        </DropdownItem>
        {visibleOptions.map((option) => (
          <DropdownItem key={option.value}>
            <ToolbarDropdownButton
              data-testid={`language-button-${option.value}`}
              size="small"
              noTitle
              disabled={option.disabled}
              onClick={() => onClick(option.value)}
            >
              {t(`languages.${option.value}`)}
            </ToolbarDropdownButton>
          </DropdownItem>
        ))}
      </ToolbarDropdownContent>
    </DropdownMenu>
  );
};
