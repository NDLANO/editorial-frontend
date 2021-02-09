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
import { handleClickBlock, handleClickMark, handleClickInline } from '../../utils/handleMenuClicks';

const topicArticleElements = {
  mark: ['bold', 'italic', 'code', 'sub', 'sup'],
  block: ['quote', ...listTypes, 'heading-two', 'heading-three'],
  inline: ['link', 'mathml', 'concept'],
};

const learningResourceElements = {
  mark: ['bold', 'italic', 'code', 'sub', 'sup'],
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

  onButtonClick(evt, kind, type) {
    if (kind === 'mark') {
      handleClickMark(evt, this.props.editor, type);
    } else if (kind === 'block') {
      handleClickBlock(evt, this.props.editor, type);
    } else if (kind === 'inline') {
      handleClickInline(evt, this.props.editor, type);
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
    const left = rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2;
    menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight}px`;
    menu.style.left = `${left}px`;
  }

  render() {
    const { editor } = this.props;

    const toolbarElements = window.location.pathname.includes('learning-resource')
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
