/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import Button from '@ndla/button';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Cross } from '@ndla/icons/action';
import { css } from 'react-emotion';
import { colors } from '@ndla/core';

const classes = new BEMHelper({
  name: 'lightbox',
  prefix: 'c-',
});

export const closeLightboxButtonStyle = css`
  float: right;
  height: 44px;
  width: 44px;
  margin-top: -5px;
  margin-right: -20px;
`;

export const closeLightboxCrossStyle = css`
  float: right;
  height: 24px;
  width: 24px;
  margin-right: 7px;
  color: ${colors.brand.grey};
`;

export default class Lightbox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { display: props.display };
    this.onCloseButtonClick = this.onCloseButtonClick.bind(this);
  }

  onCloseButtonClick(evt) {
    this.setState({ display: false }, () => this.props.onClose());
    evt.preventDefault();
  }

  static getDerivedStateFromProps({ display }, prevState) {
    if (display !== prevState.display) return { display };
    return null;
  }

  render() {
    const { children, closeButton, big, width, fullscreen, modal } = this.props;
    const modifiers = {
      big,
      fullscreen,
      modal,
    };

    const style = width ? { maxWidth: width } : undefined;

    return this.state.display ? (
      <div {...classes()}>
        <div {...classes('content', modifiers)} style={style}>
          {closeButton ? (
            closeButton
          ) : (
            <Button
              css={closeLightboxButtonStyle}
              stripped
              onClick={this.onCloseButtonClick}>
              <Cross css={closeLightboxCrossStyle} />
            </Button>
          )}
          {children}
        </div>
      </div>
    ) : null;
  }
}

Lightbox.propTypes = {
  onClose: PropTypes.func.isRequired,
  display: PropTypes.bool,
  big: PropTypes.bool,
  fullscreen: PropTypes.bool,
  modal: PropTypes.bool,
  width: PropTypes.string,
  closeButton: PropTypes.node,
};

Lightbox.defaultProps = {
  display: true,
  big: false,
  fullscreen: false,
};
