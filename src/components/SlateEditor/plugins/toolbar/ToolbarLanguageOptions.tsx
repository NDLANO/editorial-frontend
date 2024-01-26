/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Editor, Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import { ToolbarButton } from '@radix-ui/react-toolbar';
import { DropdownItem, DropdownMenu, DropdownTrigger } from '@ndla/dropdown-menu';
import { ArrowDropDown } from '@ndla/icons/common';
import UIToolbarButton from './ToolbarButton';
import { ToolbarDropdownButton, ToolbarDropdownContent } from './toolbarDropdownComponents';
import { getMarkValue } from '../mark';

export const languages = ['ar', 'de', 'en', 'es', 'fr', 'la', 'no', 'se', 'sma', 'so', 'ti', 'zh'];

export const ToolbarLanguageOptions = () => {
  const { t } = useTranslation();
  const editor = useSlate();
  const currentLanguage = getMarkValue(editor, 'lang');

  const onClick = useCallback(
    (language: string) => {
      const sel = editor.selection;
      Transforms.select(editor, sel!);
      ReactEditor.focus(editor);
      if (language === 'none') {
        Editor.removeMark(editor, 'lang');
      } else {
        Editor.addMark(editor, 'lang', language);
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
    <DropdownMenu>
      <ToolbarButton asChild>
        <DropdownTrigger asChild>
          <UIToolbarButton type="language">
            {currentLanguage ?? t('editorToolbar.noneLanguage')}
            <ArrowDropDown />
          </UIToolbarButton>
        </DropdownTrigger>
      </ToolbarButton>
      <ToolbarDropdownContent side="bottom" onCloseAutoFocus={onCloseFocus} sideOffset={2}>
        <DropdownItem>
          <ToolbarDropdownButton
            data-testid={'language-button-none'}
            size="small"
            noTitle
            onClick={() => onClick('none')}
          >
            {t('editorToolbar.noneLanguage')}
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
