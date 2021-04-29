/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// TODO: Implement lists, blocks and inlines

import React, { useEffect } from 'react';
import { Editor } from 'new-slate';
import { ReactEditor } from 'new-slate-react';
import BEMHelper from 'react-bem-helper';
import { Portal } from '../../../Portal';
import ToolbarButton from './ToolbarButton';
import { isMarkActive, toggleMark } from '../mark';
// import { listTypes } from '../externalPlugins';

const topicArticleElements: { [key: string]: string[] } = {
  mark: ['bold', 'italic', 'code', 'sub', 'sup'],
  //   block: ['quote', ...listTypes, 'heading-two', 'heading-three'],
  inline: ['link', 'mathml', 'concept'],
};

const learningResourceElements: { [key: string]: string[] } = {
  mark: ['bold', 'italic', 'code', 'sub', 'sup'],
  //   block: ['quote', ...listTypes, 'heading-two', 'heading-three'],
  inline: ['link' /* , 'footnote', 'mathml', 'concept'*/],
};

export const toolbarClasses = new BEMHelper({
  name: 'toolbar',
  prefix: 'c-',
});

interface Props {
  editor: Editor;
}

const onButtonClick = (event: Event, editor: Editor, kind: string, type: string) => {
  if (kind === 'mark') {
    event.preventDefault();
    toggleMark(editor, type);
    // }  else if (kind === 'block') {
  } else if (kind === 'inline') {
    event.preventDefault();
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
  const toolbarButtons = Object.keys(toolbarElements).map(kind =>
    toolbarElements[kind].map(type => (
      <ToolbarButton
        key={type}
        type={type}
        kind={kind}
        isActive={isMarkActive(editor, type)}
        handleOnClick={(event: Event, kind: string, type: string) => {
          onButtonClick(event, editor, kind, type);
        }}
      />
    )),
  );

  return (
    <Portal isOpened>
      <div ref={portalRef} {...toolbarClasses()}>
        {toolbarButtons}
      </div>
    </Portal>
  );
};

export default SlateToolbar;
