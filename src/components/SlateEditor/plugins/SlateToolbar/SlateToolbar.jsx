/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Portal from 'react-portal';
import BEMHelper from 'react-bem-helper';
import Types from 'slate-prop-types';
import ToolbarButton from './ToolbarButton';
import { setActiveNode } from '../../createSlateStore';
import { hasNodeOfType } from '../utils';
import { TYPE as footnote } from '../footnote';
import { TYPE as link } from '../link';
import {
  listTypes,
  editListPlugin,
  blockquotePlugin,
  editTablePlugin,
} from '../externalPlugins';
import TableToolBar from './TableToolBar';

const DEFAULT_NODE = 'paragraph';

const suportedToolbarElements = {
  mark: ['bold', 'italic', 'underlined'],
  block: ['quote', ...listTypes, 'table', 'heading-two'],
  inline: [link, footnote],
};

export const toolbarClasses = new BEMHelper({
  name: 'toolbar',
  prefix: 'c-',
});

/* eslint-disable jsx-a11y/no-static-element-interactions */
class SlateToolbar extends Component {
  constructor(props) {
    super(props);
    this.onClickMark = this.onClickMark.bind(this);
    this.onClickBlock = this.onClickBlock.bind(this);
    this.onClickInline = this.onClickInline.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.updateMenu = this.updateMenu.bind(this);
    this.state = {
      state: this.props.state,
    };
  }

  componentDidMount() {
    this.updateMenu();
  }

  componentDidUpdate() {
    this.updateMenu();
  }

  onClickBlock(e, type) {
    e.preventDefault();
    const { state } = this.props;
    const change = state.change();
    const { document } = state;
    const isActive = hasNodeOfType(state, type);
    if (type === 'quote') {
      if (blockquotePlugin.utils.isSelectionInBlockquote(state)) {
        blockquotePlugin.changes.unwrapBlockquote(change);
      } else {
        blockquotePlugin.changes.wrapInBlockquote(change);
      }
    } else if (listTypes.includes(type)) {
      const isListTypeActive = state.blocks.some(
        block =>
          !!document.getClosest(block.key, parent => parent.type === type),
      );
      // Current list type is active
      if (isListTypeActive) {
        editListPlugin.changes.unwrapList(change);
        // Current selection is list, but not the same type
      } else if (editListPlugin.utils.isSelectionInList(state)) {
        editListPlugin.changes.unwrapList(change);
        editListPlugin.changes.wrapInList(change, type);
        // No list found, wrap in list type
      } else {
        editListPlugin.changes.wrapInList(change, type);
      }
    } else if (type === 'table') {
      editTablePlugin.changes.insertTable(change, 2, 2);
    } else {
      change.setBlock(isActive ? DEFAULT_NODE : type);
    }
    this.handleStateChange(change);
  }

  onClickMark(e, type) {
    e.preventDefault();
    const { state } = this.props;
    const nextState = state.change().toggleMark(type);
    this.handleStateChange(nextState);
  }

  onClickInline(e, type) {
    e.preventDefault();
    const { slateStore, state: editorState } = this.props;

    if (editorState.inlines && editorState.inlines.size > 0) {
      const node = editorState.inlines.find(
        inline => inline.type === footnote || inline.type === link,
      );
      slateStore.dispatch(setActiveNode(node));
    } else {
      slateStore.dispatch(setActiveNode({ type }));
    }
  }

  onButtonClick(e, kind, type) {
    if (kind === 'mark') this.onClickMark(e, type);
    if (kind === 'block') this.onClickBlock(e, type);
    if (kind === 'inline') this.onClickInline(e, type);
  }

  onOpen(portal) {
    this.setState({ menu: portal.firstChild });
  }

  handleStateChange(change) {
    const { name, onChange } = this.props;
    onChange({ target: { name, value: change.state } });
    this.updateMenu();
  }

  updateMenu() {
    const { menu } = this.state;
    const { state } = this.props;
    if (!menu) return;
    if (state.isBlurred || state.isEmpty) {
      menu.removeAttribute('style');
      return;
    }
    menu.style.display = 'block';
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    menu.style.opacity = 1;
    const left =
      rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2;
    menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight}px`;
    menu.style.left = `${left}px`;
  }

  render() {
    const { state } = this.props;

    const toolbarButtons = Object.keys(suportedToolbarElements).map(kind =>
      suportedToolbarElements[kind].map(type => (
        <ToolbarButton
          key={type}
          type={type}
          kind={kind}
          state={state}
          handleHasType={hasNodeOfType}
          handleOnClick={this.onButtonClick}
        />
      )),
    );

    return (
      <Portal isOpened onOpen={this.onOpen}>
        <div {...toolbarClasses()}>
          <div {...toolbarClasses('container')}>
            {toolbarButtons}
          </div>
        </div>
      </Portal>
    );
  }
}

SlateToolbar.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  state: Types.state.isRequired,
  slateStore: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
  }),
};

export default SlateToolbar;
