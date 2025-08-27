/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Range, Transforms } from "slate";
import { ReactEditor, useSlate, useSlateSelection, useSlateSelector } from "slate-react";
import { createListCollection } from "@ark-ui/react";
import { SelectContent, SelectRoot, SelectValueText, SelectLabel, FieldRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { LanguageType } from "./toolbarState";
import { getTitle } from "./ToolbarToggle";
import { ToolbarCategoryProps } from "./types";
import { GenericSelectItem, GenericSelectTrigger } from "../../../abstractions/Select";
import { isSpanElement } from "../span/queries";
import { defaultSpanBlock } from "../span/utils";

const StyledGenericSelectTrigger = styled(GenericSelectTrigger, {
  base: {
    width: "surface.3xsmall",
  },
});

const StyledGenericSelectItem = styled(GenericSelectItem, {
  base: {
    padding: "3xsmall",
  },
});

const getCurrentLanguage = (editor: Editor) => {
  const [currentBlock] =
    Editor.nodes(editor, {
      match: isSpanElement,
      mode: "lowest",
    }) ?? [];
  const node = currentBlock?.[0];
  if (!Element.isElement(node) || node.type !== "span") return;
  return node.data.lang;
};

const positioningOptions = { sameWidth: true };

export const ToolbarLanguageOptions = ({ options }: ToolbarCategoryProps<LanguageType>) => {
  const { t, i18n } = useTranslation();
  const editor = useSlate();
  const currentLanguage = useSlateSelector(getCurrentLanguage);
  const selection = useSlateSelection();

  const onSelect = useCallback(
    (language: string | undefined) => {
      if (!selection) return;
      const unhungSelection = Editor.unhangRange(editor, selection);

      const [match] =
        Editor.nodes(editor, {
          match: isSpanElement,
          at: unhungSelection,
        }) ?? [];

      if (match) {
        const [_, path] = match;
        const spanRange = Editor.range(editor, path);

        if (language === undefined) {
          // Remove language span
          Transforms.unwrapNodes(editor, {
            match: isSpanElement,
            at: unhungSelection,
          });
        } else if (Range.isExpanded(unhungSelection) && !Range.includes(spanRange, unhungSelection)) {
          // The selection surrounds the current span, so we unwrap and wrap again to increase the size of the span
          Transforms.unwrapNodes(editor, {
            match: isSpanElement,
            at: path,
          });

          const newSelection = editor.selection ? Editor.unhangRange(editor, editor.selection) : undefined;
          Transforms.wrapNodes(
            editor,
            defaultSpanBlock({ lang: language, dir: language === "ar" ? "rtl" : undefined }),
            {
              at: newSelection,
              split: true,
            },
          );
        } else {
          // The selection is inside the current span, so we just update the lang attribute
          const data = { dir: language === "ar" ? "rtl" : undefined, lang: language };
          Transforms.setNodes(editor, { data }, { match: isSpanElement });
        }
      } else if (Range.isExpanded(unhungSelection)) {
        Transforms.wrapNodes(editor, defaultSpanBlock({ lang: language, dir: language === "ar" ? "rtl" : undefined }), {
          at: unhungSelection,
          split: true,
        });
      }
      ReactEditor.focus(editor);
    },
    [editor, selection],
  );

  const title = useMemo(() => getTitle(i18n, t, "language", false, false), [i18n, t]);

  const collection = useMemo(() => {
    const visibleOptions = options.filter((option) => !option.hidden);
    if (!visibleOptions.length) return undefined;
    return createListCollection({
      items: visibleOptions,
      itemToString: (item) => t(`languages.${item.value}`),
      itemToValue: (item) => item.value,
    });
  }, [options, t]);

  if (!collection) return null;

  return (
    <FieldRoot>
      <SelectRoot
        collection={collection}
        positioning={positioningOptions}
        value={currentLanguage ? [currentLanguage] : []}
        onSelect={({ value }) => onSelect(value)}
        onValueChange={({ value }) => value.length === 0 && onSelect(undefined)}
      >
        <SelectLabel srOnly>{title}</SelectLabel>
        <StyledGenericSelectTrigger
          clearable
          variant="tertiary"
          title={title}
          size="small"
          data-testid="toolbar-button-language"
        >
          <SelectValueText placeholder={t("languages.none")} />
        </StyledGenericSelectTrigger>
        <SelectContent>
          {collection.items.map((option) => (
            <StyledGenericSelectItem
              key={option.value}
              data-testid={`language-button-${option.value}`}
              item={{ label: option.value, value: option.value }}
            >
              {t(`languages.${option.value}`)}
            </StyledGenericSelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </FieldRoot>
  );
};
