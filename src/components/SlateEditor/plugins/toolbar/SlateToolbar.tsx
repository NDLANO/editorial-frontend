/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createRef, MouseEvent, useEffect } from 'react';
import { Editor, Element } from 'slate';
import { ReactEditor } from 'slate-react';
import BEMHelper from 'react-bem-helper';
import styled from '@emotion/styled';
import { Portal } from '../../../Portal';
import ToolbarButton from './ToolbarButton';
import { toggleMark } from '../mark/utils';
import { handleClickInline, handleClickBlock, handleClickTable } from './handleMenuClicks';
import hasNodeWithProps from '../../utils/hasNodeWithProps';
import { isMarkActive } from '../mark';
import { LIST_TYPES as listTypes } from '../list/types';
import hasListItem from '../list/utils/hasListItem';
import getCurrentBlock from '../../utils/getCurrentBlock';
import { hasCellAlignOfType } from '../table/helpers';
import { TYPE_TABLE_CELL } from '../table/types';

const topicArticleElements: { [key: string]: string[] } = {
  mark: ['bold', 'italic', 'code', 'sub', 'sup'],
  block: ['quote', 'heading-2', 'heading-3', ...listTypes],
  inline: ['link', 'mathml', 'concept', 'span'],
};

const learningResourceElements: { [key: string]: string[] } = {
  mark: ['bold', 'italic', 'code', 'sub', 'sup'],
  block: ['quote', 'heading-2', 'heading-3', ...listTypes],
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
};

export const toolbarClasses = new BEMHelper({
  name: 'toolbar',
  prefix: 'c-',
});

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
  box-shadow: 3px 3px 5px rgba(153, 153, 153, 0.349019607843137);
`;

interface Props {
  editor: Editor;
}

const onButtonClick = (event: MouseEvent, editor: Editor, kind: string, type: string) => {
  if (kind === 'mark') {
    toggleMark(event, editor, type);
  } else if (kind === 'block') {
    handleClickBlock(event, editor, type);
  } else if (kind === 'inline') {
    handleClickInline(event, editor, type);
  } else if (kind === 'table') {
    handleClickTable(event, editor, type);
  }
};

const SlateToolbar = (props: Props) => {
  const portalRef = createRef<HTMLDivElement>();

  useEffect(() => {
    updateMenu();
  });

  const updateMenu = () => {
    const menu = portalRef.current;
    const {
      editor: { selection },
    } = props;
    if (!menu) {
      return;
    }
    if (
      !ReactEditor.isFocused(editor) ||
      !selection ||
      !selection?.anchor ||
      !selection?.focus ||
      Editor.string(editor, { anchor: selection?.anchor, focus: selection?.focus }) === ''
    ) {
      menu.removeAttribute('style');
      return;
    }

    if (!editor.shouldShowToolbar()) {
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
  };

  const { editor } = props;

  const toolbarElements = window.location.pathname.includes('learning-resource')
    ? learningResourceElements
    : topicArticleElements;

  const markButtons = toolbarElements.mark.map(type => (
    <ToolbarButton
      key={type}
      type={type}
      kind={'mark'}
      isActive={isMarkActive(editor, type)}
      handleOnClick={(event: MouseEvent, kind: string, type: string) => {
        onButtonClick(event, editor, kind, type);
      }}
    />
  ));

  const blockButtons = toolbarElements.block.map(type => (
    <ToolbarButton
      key={type}
      type={type}
      kind={'block'}
      isActive={
        type.includes('list')
          ? hasListItem(editor, type)
          : hasNodeWithProps(editor, specialRules[type] ?? { type })
      }
      handleOnClick={(event: MouseEvent, kind: string, type: string) => {
        onButtonClick(event, editor, kind, type);
      }}
    />
  ));
  const inlineButtons = toolbarElements.inline.map(type => (
    <ToolbarButton
      key={type}
      type={type}
      kind={'inline'}
      isActive={hasNodeWithProps(editor, specialRules[type] ?? { type })}
      handleOnClick={(event: MouseEvent, kind: string, type: string) => {
        onButtonClick(event, editor, kind, type);
      }}
    />
  ));

  const tableCellElement = getCurrentBlock(editor, TYPE_TABLE_CELL)?.[0];
  const tableButtons =
    !!tableCellElement &&
    toolbarElements.table?.map(type => (
      <ToolbarButton
        type={type}
        kind={'table'}
        isActive={hasCellAlignOfType(editor, type)}
        handleOnClick={(event: MouseEvent, kind: string, type: string) => {
          onButtonClick(event, editor, kind, type);
        }}
      />
    ));

  return (
    <Portal isOpened>
      <ToolbarContainer ref={portalRef}>
        {markButtons}
        {blockButtons}
        {inlineButtons}
        {tableButtons}
      </ToolbarContainer>
    </Portal>
  );
};

export default SlateToolbar;
