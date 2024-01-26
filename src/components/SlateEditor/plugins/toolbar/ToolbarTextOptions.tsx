/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Element, Editor, Transforms } from 'slate';
import { ReactEditor, useSlate, useSlateSelector } from 'slate-react';
import { ToolbarButton } from '@radix-ui/react-toolbar';
import { DropdownItem, DropdownMenu, DropdownTrigger } from '@ndla/dropdown-menu';
import { ArrowDropDown } from '@ndla/icons/common';
import { handleTextChange } from './handleMenuClicks';
import { ToolbarCategoryProps } from './SlateToolbar';
import UIToolbarButton from './ToolbarButton';
import { ToolbarDropdownButton, ToolbarDropdownContent } from './toolbarDropdownComponents';
import { TextType } from './toolbarState';

const getTextValue = (editor: Editor): TextType => {
  const [match] = editor.selection
    ? Editor.nodes(editor, {
        at: editor.selection,
        match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
        mode: 'lowest',
      })
    : [];
  const node = match?.[0];
  if (!node || !Element.isElement(node)) {
    return 'normal-text';
  }
  return node.type === 'heading' ? (`heading-${node.level}` as TextType) : 'normal-text';
};

export const ToolbarTextOptions = ({ options }: ToolbarCategoryProps<TextType>) => {
  const { t } = useTranslation();
  const editor = useSlate();
  const type = useSlateSelector(getTextValue);

  const onTextOptionClick = useCallback(
    (value: string) => {
      handleTextChange(editor, value);
    },
    [editor],
  );

  const onCloseFocus = useCallback(
    (e: Event) => {
      e.preventDefault();
      const sel = editor.selection;
      if (!sel) return;
      // Not having this timeout will cause the toolbar to close.
      setTimeout(() => {
        Transforms.select(editor, sel);
        ReactEditor.focus(editor);
      }, 10);
    },
    [editor],
  );

  const visibleOptions = options.filter((option) => !option.hidden);
  if (!visibleOptions.length) return null;

  return (
    <DropdownMenu>
      <ToolbarButton asChild>
        <DropdownTrigger asChild>
          <UIToolbarButton type={type} data-testid="toolbar-button-text">
            {t(`editorToolbar.${type}-value`)}
            <ArrowDropDown />
          </UIToolbarButton>
        </DropdownTrigger>
      </ToolbarButton>
      <ToolbarDropdownContent side="bottom" onCloseAutoFocus={onCloseFocus} sideOffset={2}>
        {visibleOptions.map((option) => (
          <DropdownItem
            key={option.value}
            disabled={option.disabled}
            data-testid={`text-option-${option.value}`}
            onSelect={() => onTextOptionClick(option.value)}
          >
            <ToolbarDropdownButton disabled={option.disabled} size="small" type={option.value}>
              {t(`editorToolbar.${option.value}-value`)}
            </ToolbarDropdownButton>
          </DropdownItem>
        ))}
      </ToolbarDropdownContent>
    </DropdownMenu>
  );
};
