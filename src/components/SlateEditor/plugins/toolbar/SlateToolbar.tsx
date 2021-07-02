/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { KeyboardEvent, useEffect } from 'react';
import { Editor, Element } from 'slate';
import { ReactEditor } from 'slate-react';
import BEMHelper from 'react-bem-helper';
import { Portal } from '../../../Portal';
import ToolbarButton from './ToolbarButton';
import { toggleMark } from '../mark/utils';
import { handleClickInline, handleClickBlock } from './handleMenuClicks';
import hasNodeWithProps from '../../utils/hasNodeWithProps';
import { isMarkActive } from '../mark';
// import { listTypes } from '../externalPlugins';

const topicArticleElements: { [key: string]: string[] } = {
  mark: ['bold', 'italic', 'code', 'sub', 'sup'],
  block: ['quote', 'heading-2', 'heading-3' /*, ...listTypes*/],
  inline: ['link', 'mathml', 'concept'],
};

const learningResourceElements: { [key: string]: string[] } = {
  mark: ['bold', 'italic', 'code', 'sub', 'sup'],
  block: ['quote', 'heading-2', 'heading-3' /*, ...listTypes*/],
  inline: ['link', 'footnote', 'mathml', 'concept'],
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

interface Props {
  editor: Editor;
}

const onButtonClick = (
  event: KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  kind: string,
  type: string,
) => {
  if (kind === 'mark') {
    toggleMark(event, editor, type);
  } else if (kind === 'block') {
    handleClickBlock(event, editor, type);
  } else if (kind === 'inline') {
    handleClickInline(event, editor, type);
  }
};

const SlateToolbar = (props: Props) => {
  const portalRef = React.createRef<HTMLDivElement>();

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
    menu.style.left = `${left}px`;
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
      handleOnClick={(event: KeyboardEvent<HTMLDivElement>, kind: string, type: string) => {
        onButtonClick(event, editor, kind, type);
      }}
    />
  ));

  const blockButtons = toolbarElements.block.map(type => (
    <ToolbarButton
      key={type}
      type={type}
      kind={'block'}
      isActive={hasNodeWithProps(editor, specialRules[type] ?? { type })}
      handleOnClick={(event: KeyboardEvent<HTMLDivElement>, kind: string, type: string) => {
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
      handleOnClick={(event: KeyboardEvent<HTMLDivElement>, kind: string, type: string) => {
        onButtonClick(event, editor, kind, type);
      }}
    />
  ));

  return (
    <Portal isOpened>
      <div ref={portalRef} {...toolbarClasses()}>
        {markButtons}
        {blockButtons}
        {inlineButtons}
      </div>
    </Portal>
  );
};

export default SlateToolbar;
