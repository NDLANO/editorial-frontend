/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Portal } from '../../../Portal';
import ToolbarButton from './ToolbarButton';
import { hasNodeOfType } from '../../utils';
import { listTypes } from '../externalPlugins';

const topicArticleElements = {
  mark: ['bold', 'italic'],
  block: ['quote', ...listTypes, 'heading-two', 'heading-three'],
  inline: ['link'],
};

const DEFAULT_NODE = 'paragraph';

const learningResourceElements = {
  mark: ['bold', 'italic'],
  block: ['quote', ...listTypes, 'heading-two', 'heading-three'],
  inline: ['link', 'footnote', 'mathml', 'concept'],
};

export const toolbarClasses = new BEMHelper({
  name: 'toolbar',
  prefix: 'c-',
});

class SlateToolbar extends Component {
  constructor(props) {
    super(props);
    this.onClickMark = this.onClickMark.bind(this);
    this.onClickBlock = this.onClickBlock.bind(this);
    this.onClickInline = this.onClickInline.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.portalRef = React.createRef();
    this.updateMenu = this.updateMenu.bind(this);
  }

  componentDidMount() {
    this.updateMenu();
  }

  componentDidUpdate() {
    this.updateMenu();
  }

  onClickBlock(e, type) {
    e.preventDefault();
    const { editor } = this.props;
    const { document, blocks } = editor.value;
    const isActive = hasNodeOfType(editor, type);
    if (type === 'quote') {
      if (editor.isSelectionInBlockquote()) {
        editor.unwrapBlockquote();
      } else {
        editor.wrapInBlockquote();
      }
    } else if (listTypes.includes(type)) {
      const isListTypeActive = blocks.some(
        block =>
          !!document.getClosest(block.key, parent => parent.type === type),
      );
      // Current list type is active
      if (isListTypeActive) {
        editor.unwrapList();
        // Current selection is list, but not the same type
      } else if (editor.isSelectionInList()) {
        editor.unwrapList();
        editor.wrapInList(type);
        // No list found, wrap in list type
      } else {
        editor.wrapInList(type);
      }
    } else {
      editor.setBlocks(isActive ? DEFAULT_NODE : type);
    }
  }

  onClickMark(e, type) {
    e.preventDefault();
    const { editor } = this.props;
    editor.toggleMark(type);
  }

  onClickInline(e, type) {
    e.preventDefault();
    const { editor } = this.props;

    if (type === 'footnote') {
      editor
        .moveToEnd()
        .insertText('#')
        .moveFocusForward(-1)
        .wrapInline(type);
    } else {
      editor.withoutNormalizing(() => {
        editor.wrapInline(type);
      });
    }
  }

  onButtonClick(evt, kind, type) {
    if (kind === 'mark') {
      this.onClickMark(evt, type);
    } else if (kind === 'block') {
      this.onClickBlock(evt, type);
    } else if (kind === 'inline') {
      this.onClickInline(evt, type);
    }
  }

  updateMenu() {
    const menu = this.portalRef.current;
    const {
      editor: {
        value: { selection, fragment },
      },
    } = this.props;
    if (!menu) {
      return;
    }
    if (selection.isBlurred || selection.isCollapsed || fragment.text === '') {
      menu.removeAttribute('style');
      return;
    }
    menu.style.display = 'block';
    const native = window.getSelection();
    const range = native.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    menu.style.opacity = 1;
    const left =
      rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2;
    menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight}px`;
    menu.style.left = `${left}px`;
  }

  render() {
    const { editor } = this.props;

    const toolbarElements = window.location.pathname.includes(
      'learning-resource',
    )
      ? learningResourceElements
      : topicArticleElements;
    const toolbarButtons = Object.keys(toolbarElements).map(kind =>
      toolbarElements[kind].map(type => (
        <ToolbarButton
          key={type}
          type={type}
          kind={kind}
          isActive={hasNodeOfType(editor, type, kind)}
          handleOnClick={this.onButtonClick}
        />
      )),
    );

    return (
      <Portal isOpened>
        <div ref={this.portalRef} {...toolbarClasses()}>
          {toolbarButtons}
        </div>
      </Portal>
    );
  }
}

SlateToolbar.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  editor: PropTypes.object.isRequired,
  slateStore: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
  }),
};

export default SlateToolbar;
