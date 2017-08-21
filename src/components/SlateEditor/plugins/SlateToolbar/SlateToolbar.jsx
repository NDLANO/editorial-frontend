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
  Quote, // TODO: Change to Quote when Icon is available
  Strikethrough,
  Underline,
  Link,
} from 'ndla-ui/icons';
import { renderMarkButton, renderBlockButton } from './SlateToolbarButtons';
import SlateToolbarLink from './SlateToolbarLink';

const DEFAULT_NODE = 'paragraph';

/* eslint-disable jsx-a11y/no-static-element-interactions */

class SlateToolbar extends Component {
  constructor(props) {
    super(props);
    this.onClickMark = this.onClickMark.bind(this);
    this.onClickBlock = this.onClickBlock.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.hasMark = this.hasMark.bind(this);
    this.hasBlock = this.hasBlock.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.updateMenu = this.updateMenu.bind(this);
    this.onContentLinkSubmit = this.onContentLinkSubmit.bind(this);
    this.state = {
      state: this.props.state,
      contentLink: {
        url: '',
        text: '',
        showDialog: false,
      }
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
    if(type === 'link') {
      this.setState({contentLink: {showDialog: true}})
      return;
    }
    // Handle everything but list buttons.
    else if (type !== 'bulleted-list' && type !== 'numbered-list') {
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

  onContentLinkSubmit(evt) {
    console.log(evt)
    const { state } = this.props;
    const transform = state.transform();
    if (evt === 'link') {
      const isActive = this.hasBlock(type);
      const href = prompt('Enter the URL of the link:')
      const isNDLAUrl = (/^https:\/(.*).ndla.no\/article\/\d*/).test(href);
      if (isNDLAUrl) {
        const text = prompt('Enter the text for the link:');
        if (!text || !href) return;
        if (isActive) {
          transform.setBlock(DEFAULT_NODE);
        } else {
          const splittedHref = href.split('/');
          const id = splittedHref[splittedHref.length - 1];
          transform
          .insertText(text)
          .extend(0 - text.length)
          .wrapInline({
            type: 'link',
            data: { id, resource: 'content-link', contentLinkText: text }
          })
          .collapseToEnd()
          .apply();
        }
      }
    }
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


  render() {
    return (
      <div>
        <SlateToolbarLink {...this.state.contentLink} />
        <Portal isOpened onOpen={this.onOpen}>
          <div className="c-toolbar">
            {renderMarkButton('bold', <Bold />, this.hasMark, this.onClickMark)}
            {renderMarkButton(
              'italic',
              <Italic />,
              this.hasMark,
              this.onClickMark,
            )}
            {renderMarkButton(
              'underlined',
              <Underline />,
              this.hasMark,
              this.onClickMark,
            )}
            {renderMarkButton(
              'strikethrough',
              <Strikethrough />,
              this.hasMark,
              this.onClickMark,
            )}
            {renderMarkButton('code', <Embed />, this.hasMark, this.onClickMark)}
            {renderBlockButton(
              'quote',
              <Quote />,
              this.hasBlock,
              this.onClickBlock,
            )}
            {renderBlockButton(
              'link',
              <Link />,
              this.hasBlock,
              this.onClickBlock,
            )}
            {renderBlockButton(
              'numbered-list',
              <ListNumbered />,
              this.hasBlock,
              this.onClickBlock,
            )}
            {renderBlockButton(
              'bulleted-list',
              <ListCircle />,
              this.hasBlock,
              this.onClickBlock,
            )}
            {/* TODO: To be implemented when requested
            {renderBlockButton('paragraph-left', <ParagraphLeft />, this.hasBlock, this.onClickBlock)}
            {renderBlockButton('paragraph-center', <ParagraphCenter />, this.hasBlock, this.onClickBlock)}
            {renderBlockButton('paragraph-right', <ParagraphRight />, this.hasBlock, this.onClickBlock)}
            {renderBlockButton('paragraph-justify', <ParagraphJustify />, this.hasBlock, this.onClickBlock)} */}
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
