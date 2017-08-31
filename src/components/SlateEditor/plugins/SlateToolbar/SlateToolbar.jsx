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
import ToolbarButton from './ToolbarButton';
import SlateToolbarLink from './SlateToolbarLink';

const DEFAULT_NODE = 'paragraph';

const suportedToolbarElements = {
  marks: ['bold', 'italic', 'underlined', 'code', 'strikethrough'],
  blocks: [
    'quote',
    'link',
    'numbered-list',
    'bulleted-list',
    'heading-one',
    'heading-two',
    'heading-three',
  ],
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
    this.onOpen = this.onOpen.bind(this);
    this.hasMark = this.hasMark.bind(this);
    this.hasBlock = this.hasBlock.bind(this);
    this.hasInlines = this.hasInlines.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.updateMenu = this.updateMenu.bind(this);
    this.onCloseContentlinkDialog = this.onCloseContentlinkDialog.bind(this);
    this.state = {
      state: this.props.state,
      showContentlinkDialog: false,
    };
  }

  componentDidMount() {
    this.updateMenu();
  }

  componentDidUpdate() {
    this.updateMenu();
  }

  onClickMark(e, type) {
    e.preventDefault();
    const { state } = this.props;
    const nextState = state.transform().toggleMark(type).apply();

    this.handleStateChange(nextState);
  }
  onCloseContentlinkDialog() {
    this.setState({ showContentlinkDialog: false });
  }

  onClickBlock(e, type) {
    e.preventDefault();
    const { state } = this.props;
    const transform = state.transform();
    const { document } = state;
    if (type === 'link') {
      this.setState({ showContentlinkDialog: true });
    } else if (type !== 'bulleted-list' && type !== 'numbered-list') {
      // Handle everything but list buttons.
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock('list-item');

      if (isList) {
        transform
          .setBlock(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else {
        transform.setBlock(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item');
      const isType = state.blocks.some(
        block =>
          !!document.getClosest(block.key, parent => parent.type === type),
      );

      if (isList && isType) {
        transform
          .setBlock(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else if (isList) {
        transform
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list',
          )
          .wrapBlock(type);
      } else {
        transform.setBlock('list-item').wrapBlock(type);
      }
    }

    const nextState = transform.apply();
    this.handleStateChange(nextState);
  }

  onOpen(portal) {
    this.setState({ menu: portal.firstChild });
  }

  onContentLinkChange(evt) {
    const name = evt.target.name;
    const value = evt.target.value;

    this.setState(prevState => ({
      contentLink: {
        ...prevState.contentLink,
        [name]: value,
      },
    }));
  }

  handleStateChange(state) {
    const { name, onChange, handleBlockContentChange, index } = this.props;
    if (handleBlockContentChange) {
      handleBlockContentChange(state, index);
      return;
    }

    onChange({ target: { name, value: state } });
  }

  hasMark(type) {
    const { state } = this.props;
    return state.marks.some(mark => mark.type === type);
  }

  hasBlock(type) {
    const { state } = this.props;
    return state.blocks.some(node => node.type === type);
  }

  hasInlines(type) {
    const { state } = this.props;
    return state.inlines.some(node => node.type === type);
  }

  updateMenu() {
    const { menu } = this.state;
    const { state } = this.props;
    if (!menu) return;
    if (state.isBlurred || state.isEmpty) {
      menu.removeAttribute('style');
      return;
    }
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    menu.style.opacity = 1;
    menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight}px`;
    menu.style.left = `${rect.left +
      window.scrollX -
      menu.offsetWidth / 2 +
      rect.width / 2}px`;
  }

  render() {
    const { state } = this.props;
    return (
      <div>
        <SlateToolbarLink
          showDialog={this.state.showContentlinkDialog}
          closeDialog={this.onCloseContentlinkDialog}
          hasInlines={this.hasInlines}
          state={state}
          handleStateChange={this.handleStateChange}
        />
        <Portal isOpened onOpen={this.onOpen}>
          <div {...toolbarClasses()}>
            {suportedToolbarElements.marks.map(type =>
              <ToolbarButton
                key={type}
                type={type}
                handleHasType={this.hasMark}
                handleOnClick={this.onClickMark}
              />,
            )}
            {suportedToolbarElements.blocks.map(type =>
              <ToolbarButton
                key={type}
                type={type}
                handleHasType={this.hasBlock}
                handleOnClick={this.onClickBlock}
              />,
            )}
          </div>
        </Portal>
      </div>
    );
  }
}

SlateToolbar.propTypes = {
  onChange: PropTypes.func.isRequired,
  handleBlockContentChange: PropTypes.func,
  index: PropTypes.number,
  name: PropTypes.string.isRequired,
  state: PropTypes.shape({}).isRequired,
};

export default SlateToolbar;
