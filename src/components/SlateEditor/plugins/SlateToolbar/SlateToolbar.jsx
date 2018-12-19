/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import Types from 'slate-prop-types';
import { Portal } from '../../../Portal';
import ToolbarButton from './ToolbarButton';
import { hasNodeOfType, checkSelectionForType } from '../../utils';
import { TYPE as footnote } from '../footnote';
import { TYPE as link } from '../link';
import blockquotePlugin from '../blockquotePlugin';
import { listTypes, editListPlugin } from '../externalPlugins';

const DEFAULT_NODE = 'paragraph';

const supportedToolbarElements = {
  mark: ['bold', 'italic', 'underlined'],
  block: ['quote', ...listTypes, 'heading-two', 'heading-three'],
  inline: [link, footnote],
};

const supportedToolbarElementsAside = {
  mark: ['bold', 'italic', 'underlined'],
  block: ['quote', ...listTypes, 'heading-one'],
  inline: [link, footnote],
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
    this.portalRef = this.portalRef.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
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
    const isActive = hasNodeOfType(editor.value, type);
    if (type === 'quote') {
      if (blockquotePlugin.utils.isSelectionInBlockquote(editor)) {
        blockquotePlugin.changes.unwrapBlockquote(editor);
      } else {
        blockquotePlugin.changes.wrapInBlockquote(editor);
      }
    } else if (listTypes.includes(type)) {
      const isListTypeActive = blocks.some(
        block =>
          !!document.getClosest(block.key, parent => parent.type === type),
      );
      // Current list type is active
      if (isListTypeActive) {
        editListPlugin.changes.unwrapList(editor);
        // Current selection is list, but not the same type
      } else if (editListPlugin.utils.isSelectionInList(editor.value)) {
        editListPlugin.changes.unwrapList(editor);
        editListPlugin.changes.wrapInList(editor, type);
        // No list found, wrap in list type
      } else {
        editListPlugin.changes.wrapInList(editor, type);
      }
    } else {
      editor.setBlocks(isActive ? DEFAULT_NODE : type);
    }
    this.handleValueChange(editor.value);
  }

  onClickMark(e, type) {
    e.preventDefault();
    const { editor } = this.props;
    const nextState = editor.toggleMark(type);
    this.handleValueChange(nextState);
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
      editor.wrapInline(type);
    }
    this.handleValueChange(editor.value);
  }

  onButtonClick(e, kind, type) {
    if (kind === 'mark') this.onClickMark(e, type);
    if (kind === 'block') this.onClickBlock(e, type);
    if (kind === 'inline') this.onClickInline(e, type);
  }

  portalRef(menu) {
    // ReactDOM.createPortal callback ref only seems to return a ReactPortal node instance
    // eslint-disable-next-line react/no-find-dom-node
    this.menu = findDOMNode(menu);
  }

  handleValueChange(value) {
    const { name, onChange } = this.props;
    onChange({ target: { name, value: value } });
    this.updateMenu();
  }

  updateMenu() {
    const { menu } = this;
    const {
      editor: {
        value: { selection, fragment },
      },
    } = this.props;
    if (!menu) return;
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
    const {
      editor: { value },
    } = this.props;
    console.log(this.props.editor);
    const toolbarElements = checkSelectionForType(
      'aside',
      value,
      value.selection.start.key,
    )
      ? supportedToolbarElementsAside
      : supportedToolbarElements;
    const toolbarButtons = Object.keys(toolbarElements).map(kind =>
      toolbarElements[kind].map(type => (
        <ToolbarButton
          key={type}
          type={type}
          kind={kind}
          value={value}
          handleHasType={hasNodeOfType}
          handleOnClick={this.onButtonClick}
        />
      )),
    );

    return (
      <Portal isOpened ref={this.portalRef}>
        <div {...toolbarClasses()}>{toolbarButtons}</div>
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
