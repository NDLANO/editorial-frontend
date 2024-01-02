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
import { colors, spacing } from '@ndla/core';
import { handleClickInline, handleClickBlock, handleClickTable } from './handleMenuClicks';
import ToolbarButton from './ToolbarButton';
import getCurrentBlock from '../../utils/getCurrentBlock';
import hasNodeWithProps from '../../utils/hasNodeWithProps';
import { TYPE_DEFINITION_LIST } from '../definitionList/types';
import hasDefinitionListItem from '../definitionList/utils/hasDefinitionListItem';
import { LIST_TYPES as listTypes } from '../list/types';
import hasListItem from '../list/utils/hasListItem';
import { isMarkActive } from '../mark';
import { toggleMark } from '../mark/utils';
import { hasCellAlignOfType } from '../table/slateHelpers';
import { TYPE_TABLE_CELL } from '../table/types';

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
  left: -10000px;
  opacity: 0;
  position: absolute;
  top: -10000px;
  transition: opacity 0.75s;
  z-index: 11;
`;

const ToolbarButtons = styled.div`
  background-color: ${colors.white};
  border-radius: ${spacing.xxsmall};
  box-shadow: 3px 3px ${spacing.xsmall} #99999959;
  color: ${colors.black};
  margin: -6px 0 ${spacing.xsmall};
`;

const ToolbarSubMenu = styled.div`
  display: none;
  &:not(:empty) {
    display: inline-block;
  }
`;

export const showToolbar = (toolbar: HTMLElement) => {
  toolbar.style.display = 'block';
  const native = window.getSelection();
  if (!native) {
    return;
  }
  const range = native.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  toolbar.style.opacity = '1';
  const left = rect.left + window.scrollX - toolbar.offsetWidth / 2 + rect.width / 2;

  toolbar.style.top = `${rect.top + window.scrollY - toolbar.offsetHeight}px`;
  toolbar.style.left = `${left > 10 ? left : 10}px`;
};

const SlateToolbar = () => {
  const portalRef = createRef<HTMLDivElement>();
  const editor = useSlate();
  const inFocus = useFocused();

  const toolbarElements = useMemo(
    () => (window.location.pathname.includes('learning-resource') ? learningResourceElements : topicArticleElements),
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

    showToolbar(menu);
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
      <ToolbarContainer id="toolbarContainer" ref={portalRef} onMouseDown={onMouseDown}>
        <ToolbarButtons>
          {toolbarElements.mark.map((type) => (
            <ToolbarButton
              key={type}
              type={type}
              kind="mark"
              isActive={isMarkActive(editor, type)}
              handleOnClick={onButtonClick}
            />
          ))}
          {toolbarElements.block.map((type) => (
            <ToolbarButton
              key={type}
              type={type}
              kind="block"
              isActive={
                type.includes('list') ? isActiveList(type) : hasNodeWithProps(editor, specialRules[type] ?? { type })
              }
              handleOnClick={onButtonClick}
            />
          ))}
          {toolbarElements.inline.map((type) => (
            <ToolbarButton
              key={type}
              type={type}
              kind="inline"
              isActive={hasNodeWithProps(editor, specialRules[type] ?? { type })}
              handleOnClick={onButtonClick}
            />
          ))}

          {getCurrentBlock(editor, TYPE_TABLE_CELL) &&
            toolbarElements.table?.map((type, index) => (
              <ToolbarButton
                key={index}
                type={type}
                kind="table"
                isActive={hasCellAlignOfType(editor, type)}
                handleOnClick={onButtonClick}
              />
            ))}
        </ToolbarButtons>
        <ToolbarSubMenu id="toolbarPortal"></ToolbarSubMenu>
      </ToolbarContainer>
    </Portal>
  );
};

export default memo(SlateToolbar);
