/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Types from 'slate-prop-types';
import Button from '@ndla/button';
import BEMHelper from 'react-bem-helper';
import { css } from '@emotion/core';
import { colors } from '@ndla/core';
import DeleteButton from '../../../DeleteButton';
import MoveContentButton from '../../../MoveContentButton';
import { EditorShape } from '../../../../shapes';

const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

const factBoxButtonStyle = css`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 2px;
  z-index: 9;
  box-shadow: 0 0 15px hsla(0, 0%, 50%, 0.3);
  margin: auto;
  padding: 5px 15px !important;
  width: 0;
  height: 33px;
  text-align: center;
  font-size: 14px;
  border-radius: 50% !important;

  &:after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 45%;
    left: 32%;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid ${colors.brand.white};
  }

  &:hover,
  &:active {
    background: ${colors.brand.dark} !important;
  }
`;

class SlateFactAside extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: true,
    };
    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.onMoveContent = this.onMoveContent.bind(this);
  }

  toggleExpanded(evt) {
    evt.preventDefault();
    this.setState(prevState => ({
      expanded: !prevState.expanded,
    }));
  }

  onMoveContent() {
    const { editor, node } = this.props;
    editor.unwrapBlockByKey(node.key, node.type);
  }

  render() {
    const { children, onRemoveClick, attributes } = this.props;

    return (
      <aside
        {...classes('fact-aside', '', this.state.expanded ? 'c-factbox expanded' : 'c-factbox')}
        draggable
        {...attributes}>
        <div className="c-factbox__content c-bodybox">
          <MoveContentButton onMouseDown={this.onMoveContent} />
          <DeleteButton stripped onMouseDown={onRemoveClick} data-cy="remove-fact-aside" />
          {children}
        </div>
        <Button
          onMouseDown={this.toggleExpanded}
          className="c-factbox__button"
          css={factBoxButtonStyle}
        />
      </aside>
    );
  }
}

SlateFactAside.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  onRemoveClick: PropTypes.func.isRequired,
  editor: EditorShape.isRequired,
  node: Types.node.isRequired,
};

export default SlateFactAside;
