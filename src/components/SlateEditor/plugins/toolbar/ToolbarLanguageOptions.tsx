/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Transforms } from "slate";
import { ReactEditor, useSlate, useSlateSelection, useSlateSelector } from "slate-react";
import { createListCollection, SelectValueChangeDetails } from "@ark-ui/react";
import { SelectContent, SelectRoot, SelectValueText, SelectLabel, FieldRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ToolbarCategoryProps } from "./SlateToolbar";
import { LanguageType } from "./toolbarState";
import { getTitle } from "./ToolbarToggle";
import { GenericSelectItem, GenericSelectTrigger } from "../../../abstractions/Select";
import hasNodeOfType from "../../utils/hasNodeOfType";
import { defaultSpanBlock } from "../span/utils";

const StyledGenericSelectTrigger = styled(GenericSelectTrigger, {
  base: {
    width: "surface.3xsmall",
  },
});

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

const positioningOptions = { sameWidth: true };

export const ToolbarLanguageOptions = ({ options }: ToolbarCategoryProps<LanguageType>) => {
  const { t, i18n } = useTranslation();
  const editor = useSlate();
  const currentLanguage = useSlateSelector(getCurrentLanguage);
  const selection = useSlateSelection();

  const onClick = useCallback(
    (details: SelectValueChangeDetails) => {
      if (!selection) return;
      const language = details.value[0];
      Transforms.select(editor, selection);
      ReactEditor.focus(editor);
      const wrappedInSpan = hasNodeOfType(editor, "span");
      if (wrappedInSpan && language === undefined) {
        Transforms.unwrapNodes(editor, {
          match: (node) => Element.isElement(node) && node.type === "span",
        });
      } else if (language === undefined) {
        return;
      } else if (!wrappedInSpan) {
        Transforms.wrapNodes(editor, defaultSpanBlock({ lang: language, dir: language === "ar" ? "rtl" : undefined }), {
          at: Editor.unhangRange(editor, selection),
          split: true,
        });
      } else {
        const data = { dir: language === "ar" ? "rtl" : undefined, lang: language };
        Transforms.setNodes(editor, { data }, { match: (n) => Element.isElement(n) && n.type === "span" });
      }
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
        onValueChange={onClick}
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
            <GenericSelectItem
              key={option.value}
              data-testid={`language-button-${option.value}`}
              item={{ label: option.value, value: option.value }}
            >
              {t(`languages.${option.value}`)}
            </GenericSelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </FieldRoot>
  );
};
