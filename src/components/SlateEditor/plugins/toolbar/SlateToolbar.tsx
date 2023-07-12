/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createRef, memo, MouseEvent, useCallback, useEffect, useMemo } from 'react';
import { Editor, Element, Range } from 'slate';
import { useFocused, useSlate } from 'slate-react';
import styled from '@emotion/styled';
import { Portal } from '@radix-ui/react-portal';
import ToolbarButton from './ToolbarButton';
import { toggleMark } from '../mark/utils';
import { handleClickInline, handleClickBlock, handleClickTable } from './handleMenuClicks';
import hasNodeWithProps from '../../utils/hasNodeWithProps';
import { isMarkActive } from '../mark';
import { LIST_TYPES as listTypes } from '../list/types';
import hasListItem from '../list/utils/hasListItem';
import getCurrentBlock from '../../utils/getCurrentBlock';
import { TYPE_TABLE_CELL } from '../table/types';
import { hasCellAlignOfType } from '../table/slateHelpers';
import { TYPE_DEFINITION_LIST } from '../definitionList/types';
import hasDefinitionListItem from '../definitionList/utils/hasDefinitionListItem';

const topicArticleElements: { [key: string]: string[] } = {
  mark: ['bold', 'italic', 'code', 'sub', 'sup'],
  block: ['quote', 'heading-2', 'heading-3', 'heading-4', 'definition-list', ...listTypes],
  inline: ['link', 'mathml', 'concept', 'span'],
};

const learningResourceElements: { [key: string]: string[] } = {
  mark: ['bold', 'italic', 'code', 'sub', 'sup'],
  block: ['quote', 'heading-2', 'heading-3', 'heading-4', 'definition-list', ...listTypes],
  inline: ['link', 'mathml', 'concept', 'span'],
  table: ['left', 'center', 'right'],
};

const specialRules: { [key: string]: Partial<Element> } = {
  'heading-2': {
    type: 'heading',
    level: 2,
  },
  'heading-3': {
    type: 'heading',
    level: 3,
  },
  'heading-4': {
    type: 'heading',
    level: 4,
  },
};

const ToolbarContainer = styled.div`
  border-radius: 4px;
  position: absolute;
  z-index: 11;
  top: -10000px;
  left: -10000px;
  margin-top: -6px;
  opacity: 0;
  color: black;
  background-color: white;
  transition: opacity 0.75s;
  box-shadow: 3px 3px 5px #99999959;
`;

const SlateToolbar = () => {
  const portalRef = createRef<HTMLDivElement>();
  const editor = useSlate();
  const inFocus = useFocused();

  const toolbarElements = useMemo(
    () =>
      window.location.pathname.includes('learning-resource')
        ? learningResourceElements
        : topicArticleElements,
    [],
  );

  useEffect(() => {
    const menu = portalRef.current;
    const selection = editor.selection;
    if (!menu) {
      return;
    }
    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === '' ||
      !editor.shouldShowToolbar()
    ) {
      menu.removeAttribute('style');
      return;
    }

    menu.style.display = 'block';
    const native = window.getSelection();
    if (!native) {
      return;
    }
    const range = native.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    menu.style.opacity = '1';
    const left = rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2;

    menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight}px`;
    menu.style.left = `${left > 10 ? left : 10}px`;
  });

  const onButtonClick = useCallback(
    (event: MouseEvent, kind: string, type: string) => {
      if (kind === 'mark') {
        toggleMark(event, editor, type);
      } else if (kind === 'block') {
        handleClickBlock(event, editor, type);
      } else if (kind === 'inline') {
        handleClickInline(event, editor, type);
      } else if (kind === 'table') {
        handleClickTable(event, editor, type);
      }
    },
    [editor],
  );

  const isActiveList = useCallback(
    (type: string) => {
      if (type === 'definition-list') {
        const path = getCurrentBlock(editor, TYPE_DEFINITION_LIST)?.[1];
        if (path) {
          return hasDefinitionListItem(editor);
        }
        return false;
      }
      return hasListItem(editor, type);
    },
    [editor],
  );

  const onMouseDown = useCallback((e: MouseEvent) => e.preventDefault(), []);

  return (
    <Portal>
      <ToolbarContainer ref={portalRef} onMouseDown={onMouseDown}>
        {toolbarElements.mark.map((type) => (
          <ToolbarButton
            key={type}
            type={type}
            kind={'mark'}
            isActive={isMarkActive(editor, type)}
            handleOnClick={onButtonClick}
          />
        ))}
        {toolbarElements.block.map((type) => (
          <ToolbarButton
            key={type}
            type={type}
            kind={'block'}
            isActive={
              type.includes('list')
                ? isActiveList(type)
                : hasNodeWithProps(editor, specialRules[type] ?? { type })
            }
            handleOnClick={onButtonClick}
          />
        ))}
        {toolbarElements.inline.map((type) => (
          <ToolbarButton
            key={type}
            type={type}
            kind={'inline'}
            isActive={hasNodeWithProps(editor, specialRules[type] ?? { type })}
            handleOnClick={onButtonClick}
          />
        ))}
        {getCurrentBlock(editor, TYPE_TABLE_CELL) &&
          toolbarElements.table?.map((type, index) => (
            <ToolbarButton
              key={index}
              type={type}
              kind={'table'}
              isActive={hasCellAlignOfType(editor, type)}
              handleOnClick={onButtonClick}
            />
          ))}
      </ToolbarContainer>
    </Portal>
  );
};

export default memo(SlateToolbar);
