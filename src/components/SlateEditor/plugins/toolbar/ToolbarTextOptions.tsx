/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Element, Editor, Transforms } from "slate";
import { ReactEditor, useSlate, useSlateSelection, useSlateSelector } from "slate-react";
import { createListCollection } from "@ark-ui/react";
import { SelectContent, SelectItem, SelectItemText, SelectLabel, SelectRoot, SelectValueText } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { handleTextChange } from "./handleMenuClicks";
import { ToolbarCategoryProps } from "./SlateToolbar";
import { TextType } from "./toolbarState";
import { getTitle, iconMapping } from "./ToolbarToggle";
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
  const [match] = editor.selection
    ? Editor.nodes(editor, {
        at: editor.selection,
        match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
        mode: "lowest",
      })
    : [];
  const node = match?.[0];
  if (!node || !Element.isElement(node)) {
    return "normal-text";
  }
  return node.type === "heading" ? (`heading-${node.level}` as TextType) : "normal-text";
};

export const ToolbarTextOptions = ({ options }: ToolbarCategoryProps<TextType>) => {
  const { t, i18n } = useTranslation();
  const editor = useSlate();
  const selection = useSlateSelection();
  const type = useSlateSelector(getTextValue);

  const onTextOptionClick = useCallback(
    (value: string) => {
      if (!selection) return;
      Transforms.select(editor, selection);
      ReactEditor.focus(editor);
      handleTextChange(editor, value);
    },
    [editor, selection],
  );

  const collection = useMemo(() => {
    const visibleOptions = options.filter((option) => !option.hidden);
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
    <SelectRoot
      collection={collection}
      positioning={{ sameWidth: true }}
      value={[type]}
      onValueChange={(details) => onTextOptionClick(details.value[0])}
    >
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
  );
};
