/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element } from 'slate';
import { useSlate, useSlateSelector } from 'slate-react';
import { ToggleItem } from '@radix-ui/react-toolbar';
import { handleClickTable } from './handleMenuClicks';
import { StyledToggleGroup, ToolbarCategoryProps } from './SlateToolbar';
import ToolbarButton from './ToolbarButton';
import { TableType } from './toolbarState';

const getCurrentBlockValues = (editor: Editor) => {
  const [currentTableCell] =
    Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === 'table-cell',
      mode: 'highest',
    }) ?? [];

  const node = currentTableCell?.[0];
  if (!Element.isElement(node) || node.type !== 'table-cell') return '';

  return node.data.align ?? '';
};

export const ToolbarTableOptions = ({ options }: ToolbarCategoryProps<TableType>) => {
  const editor = useSlate();
  const visibleOptions = options.filter((option) => !option.hidden);
  const value = useSlateSelector(getCurrentBlockValues);

  if (!visibleOptions.length) return null;

  return (
    <StyledToggleGroup type="single" value={value}>
      {visibleOptions.map((type) => (
        <ToggleItem key={type.value} value={type.value} asChild disabled={type.disabled}>
          <ToolbarButton
            type={type.value}
            onClick={(e) => handleClickTable(e, editor, type.value)}
          />
        </ToggleItem>
      ))}
    </StyledToggleGroup>
  );
};
