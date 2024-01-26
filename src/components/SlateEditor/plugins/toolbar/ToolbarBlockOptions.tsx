/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import isEqual from 'lodash/isEqual';
import { useCallback } from 'react';
import { Editor, Element } from 'slate';
import { useSlate, useSlateSelector } from 'slate-react';
import { ToggleItem } from '@radix-ui/react-toolbar';
import { StyledToggleGroup, ToolbarCategoryProps } from './SlateToolbar';
import ToolbarButton from './ToolbarButton';
import { BlockType } from './toolbarState';
import toggleBlock from '../../utils/toggleBlock';
import { toggleDefinitionList } from '../definitionList/utils/toggleDefinitionList';
import { toggleList } from '../list/utils/toggleList';

const getCurrentBlockValues = (editor: Editor) => {
  const [currentListBlock] =
    Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && (n.type === 'list' || n.type === 'definition-list'),
      mode: 'highest',
    }) ?? [];

  const [currentQuote] =
    Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === 'quote',
    }) ?? [];
  const values: BlockType[] = [];

  if (currentQuote?.[0]) {
    values.push('quote');
  }

  const node = currentListBlock?.[0];

  if (!Element.isElement(node)) return values;

  if (node.type === 'definition-list') {
    values.push('definition-list');
  } else if (node.type === 'list') {
    values.push(node.listType as BlockType);
  }
  return values;
};

export const ToolbarBlockOptions = ({ options }: ToolbarCategoryProps<BlockType>) => {
  const editor = useSlate();
  const value = useSlateSelector(getCurrentBlockValues, isEqual);

  const onClick = useCallback(
    (type: BlockType) => {
      if (type === 'definition-list') {
        toggleDefinitionList(editor);
      } else if (type === 'quote') {
        toggleBlock(editor, 'quote');
      } else toggleList(editor, type);
    },
    [editor],
  );

  const visibleOptions = options.filter((option) => !option.hidden);
  if (!visibleOptions.length) return null;

  return (
    <StyledToggleGroup type="multiple" value={value}>
      {visibleOptions.map((type) => (
        <ToggleItem key={type.value} value={type.value} disabled={type.disabled} asChild>
          <ToolbarButton type={type.value} onClick={() => onClick(type.value)} />
        </ToggleItem>
      ))}
    </StyledToggleGroup>
  );
};
