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

const classes = new BEMHelper({
  name: 'tooltip',
  prefix: 'c-',
});

class ToolTip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
    };

    this.togglePopup = this.togglePopup.bind(this);
    this.handlePopupClick = this.handlePopupClick.bind(this);
  }

  togglePopup() {
    this.setState(prevState => ({
      showPopup: !prevState.showPopup,
    }));
  }

  handlePopupClick() {
    this.props.onPopupClick();
    this.togglePopup();
  }

  render() {
    const { showPopup } = this.state;
    const { name, messages, content, children, noPopup } = this.props;

    return (
      <span {...classes('item')}>
        <div
          role="button"
          tabIndex={0}
          aria-label={messages.ariaLabel}
          onClick={noPopup ? undefined : this.togglePopup}
          {...classes('button')}>
          {children}
        </div>
        <span
          onClick={this.handlePopupClick}
          aria-hidden="true"
          role="dialog"
          aria-labelledby={name}
          aria-describedby={name}
          {...classes('popup', showPopup ? 'visible' : '')}>
          <span {...classes('content')}>{content}</span>
        </span>
      </span>
    );
  }
}

ToolTip.propTypes = {
  name: PropTypes.string.isRequired,
  messages: PropTypes.shape({
    ariaLabel: PropTypes.string.isRequired,
  }),
  noPopup: PropTypes.bool,
  onPopupClick: PropTypes.func,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};

export default ToolTip;
