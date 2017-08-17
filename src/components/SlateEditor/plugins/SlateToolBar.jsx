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
import { Button } from 'ndla-ui';
import {
  Bold,
  Embed,
  Italic,
  ListCircle,
  ListNumbered,
  // ParagraphLeft,
  // ParagraphCenter,
  // ParagraphRight,
  // ParagraphJustify,
  Section, // TODO: Change to Quote when Icon is available
  Strikethrough,
  Underline,
} from 'ndla-ui/icons';

const DEFAULT_NODE = 'paragraph';

/* eslint-disable jsx-a11y/no-static-element-interactions */

class SlateToolBar extends Component {
  constructor(props) {
    super(props);
    this.onClickMark = this.onClickMark.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.hasMark = this.hasMark.bind(this);
    this.hasBlock = this.hasBlock.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.updateMenu = this.updateMenu.bind(this);
    this.renderMarkButton = this.renderMarkButton.bind(this);
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

  onClickMark(e, type) {
    e.preventDefault();
    const { state } = this.props;
    const nextState = state.transform().toggleMark(type).apply();

    this.handleStateChange(nextState);
  }

  onClickBlock(e, type) {
    e.preventDefault();
    const { state } = this.props;
    const transform = state.transform();
    const { document } = state;

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
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

  renderMarkButton(type, icon) {
    const isActive = this.hasMark(type);
    const onMouseDown = e => this.onClickMark(e, type);

    return (
      <Button stripped onMouseDown={onMouseDown} data-active={isActive}>
        <span className="c-toolbar__icon">
          {icon}
        </span>
      </Button>
    );
  }
  renderBlockButton(type, icon) {
    const isActive = this.hasBlock(type);
    const onMouseDown = e => this.onClickBlock(e, type);

    return (
      <Button stripped onMouseDown={onMouseDown} data-active={isActive}>
        <span className="c-toolbar__icon">
          {icon}
        </span>
      </Button>
    );
  }

  render() {
    return (
      <Portal isOpened onOpen={this.onOpen}>
        <div className="c-toolbar">
          {this.renderMarkButton('bold', <Bold />)}
          {this.renderMarkButton('italic', <Italic />)}
          {this.renderMarkButton('underlined', <Underline />)}
          {this.renderMarkButton('strikethrough', <Strikethrough />)}
          {this.renderMarkButton('code', <Embed />)}
          {this.renderBlockButton('quote', <Section />)}
          {this.renderBlockButton('numbered-list', <ListNumbered />)}
          {this.renderBlockButton('bulleted-list', <ListCircle />)}
          {/* TODO: To be implemented when requested
          {this.renderBlockButton('paragraph-left', <ParagraphLeft />)}
          {this.renderBlockButton('paragraph-center', <ParagraphCenter />)}
          {this.renderBlockButton('paragraph-right', <ParagraphRight />)}
          {this.renderBlockButton('paragraph-justify', <ParagraphJustify />)} */}
        </div>
      </Portal>
    );
  }
}

SlateToolBar.propTypes = {
  onChange: PropTypes.func.isRequired,
  handleBlockContentChange: PropTypes.func,
  index: PropTypes.number,
  name: PropTypes.string.isRequired,
  state: PropTypes.shape({}).isRequired,
};

export default SlateToolBar;
