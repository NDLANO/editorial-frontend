/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Transforms } from "slate";
import { ReactEditor, useSlate, useSlateSelector } from "slate-react";
import { ToolbarButton } from "@radix-ui/react-toolbar";
import { DropdownItem, DropdownMenu, DropdownTrigger } from "@ndla/dropdown-menu";
import { ArrowDropDown } from "@ndla/icons/common";
import UIToolbarButton from "./ToolbarButton";
import { ToolbarDropdownButton, ToolbarDropdownContent } from "./toolbarDropdownComponents";
import hasNodeOfType from "../../utils/hasNodeOfType";
import { defaultSpanBlock } from "../span/utils";

export const languages = ["ar", "de", "en", "es", "fr", "la", "no", "se", "sma", "so", "ti", "zh"];

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

export const ToolbarLanguageOptions = () => {
  const { t } = useTranslation();
  const editor = useSlate();
  const currentLanguage = useSlateSelector(getCurrentLanguage);
  const [open, setOpen] = useState(false);
  const [scrollDropdown, setScrollDropdown] = useState(false);

  const handleOpenDropdown = () => {
    setOpen(true);
    if (window.innerHeight - 75 < languages.length * 32) {
      setScrollDropdown(true);
    } else {
      setScrollDropdown(false);
    }
  };

  const onClick = useCallback(
    (language: string) => {
      setOpen(false);
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
        Transforms.setNodes(
          editor,
          { data: { lang: language } },
          { match: (n) => Element.isElement(n) && n.type === "span" },
        );
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

  return (
    <DropdownMenu modal={false} open={open}>
      <ToolbarButton asChild onClick={handleOpenDropdown}>
        <DropdownTrigger asChild>
          <UIToolbarButton type="language">
            {currentLanguage ?? t("editorToolbar.noneLanguage")}
            <ArrowDropDown />
          </UIToolbarButton>
        </DropdownTrigger>
      </ToolbarButton>
      <ToolbarDropdownContent
        side="bottom"
        onCloseAutoFocus={onCloseFocus}
        sideOffset={2}
        portal={false}
        data-dropdown-scroll={scrollDropdown}
      >
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
        {languages.map((option) => (
          <DropdownItem key={option}>
            <ToolbarDropdownButton
              data-testid={`language-button-${option}`}
              size="small"
              noTitle
              onClick={() => onClick(option)}
            >
              {t(`languages.${option}`)}
            </ToolbarDropdownButton>
          </DropdownItem>
        ))}
      </ToolbarDropdownContent>
    </DropdownMenu>
  );
};
