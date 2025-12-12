/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Transforms } from "slate";
import { ReactEditor, useSlateSelector, useSlateStatic } from "slate-react";
import { createListCollection, SelectValueChangeDetails } from "@ark-ui/react";
import {
  FieldRoot,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectLabel,
  SelectRoot,
  SelectValueText,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { handleTextChange } from "./handleMenuClicks";
import { TextType } from "./toolbarState";
import { getTitle, iconMapping } from "./ToolbarToggle";
import { ToolbarCategoryProps } from "./types";
import { GenericSelectItemIndicator, GenericSelectTrigger } from "../../../abstractions/Select";

const StyledGenericSelectTrigger = styled(GenericSelectTrigger, {
  base: {
    width: "surface.xxsmall",
    justifyContent: "space-between",
  },
});

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "baseline",
    gap: "3xsmall",
  },
});

const getTextValue = (editor: Editor): TextType => {
  const textTypes = editor.selectionElements.elements.reduce((acc, curr) => {
    if (curr.type === "paragraph") {
      acc.add("normal-text");
    } else if (curr.type === "heading") {
      acc.add(`heading-${curr.level}` as TextType);
    }
    return acc;
  }, new Set<TextType>());

  if (textTypes.size === 1) {
    return textTypes.values().next().value!;
  }
  return "normal-text";
};

const positioning = { sameWidth: true };

export const ToolbarTextOptions = ({ options }: ToolbarCategoryProps<TextType>) => {
  const { t, i18n } = useTranslation();
  const editor = useSlateStatic();
  const type = useSlateSelector(getTextValue);

  const onTextOptionClick = useCallback(
    (details: SelectValueChangeDetails) => {
      if (!editor.selection) return;
      Transforms.select(editor, editor.selection);
      ReactEditor.focus(editor);
      handleTextChange(editor, details.value[0]);
    },
    [editor],
  );

  const collection = useMemo(() => {
    const visibleOptions = options?.filter((option) => !option.hidden) ?? [];
    if (!visibleOptions.length) return undefined;
    return createListCollection({
      items: visibleOptions,
      itemToValue: (item) => item.value,
      itemToString: (item) => t(`editorToolbar.${item.value}-value`),
    });
  }, [options, t]);

  const title = useMemo(() => getTitle(i18n, t, type, false, false), [i18n, t, type]);
  const TriggerIcon = useMemo(() => (type ? iconMapping[type] : undefined), [type]);

  if (!collection) return null;

  return (
    <FieldRoot>
      <SelectRoot collection={collection} positioning={positioning} value={[type]} onValueChange={onTextOptionClick}>
        <SelectLabel srOnly>{title}</SelectLabel>
        <StyledGenericSelectTrigger variant="tertiary" size="small" title={title} data-testid="toolbar-button-text">
          {!!TriggerIcon && <TriggerIcon title={title} fontWeight="semibold" />}
          <SelectValueText />
        </StyledGenericSelectTrigger>
        <SelectContent>
          {collection.items.map((item) => {
            const Icon = item.value ? iconMapping[item.value] : undefined;
            return (
              <SelectItem item={item} data-testid={`text-option-${item.value}`} key={item.value}>
                <TextWrapper>
                  {!!Icon && <Icon />}
                  <SelectItemText>{t(`editorToolbar.${item.value}-value`)}</SelectItemText>
                </TextWrapper>
                <GenericSelectItemIndicator />
              </SelectItem>
            );
          })}
        </SelectContent>
      </SelectRoot>
    </FieldRoot>
  );
};
