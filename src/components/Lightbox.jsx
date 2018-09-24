/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Button } from 'ndla-ui';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Cross } from 'ndla-icons/action';

const classes = new BEMHelper({
  name: 'lightbox',
  prefix: 'c-',
});

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
    const { children, big, width, fullscreen, modal } = this.props;
    const modifiers = {
      big,
      fullscreen,
      modal,
    };

    const style = width ? { maxWidth: width } : undefined;

    return this.state.display ? (
      <div {...classes()}>
        <div {...classes('content', modifiers)} style={style}>
          <Button
            {...classes('close')}
            stripped
            onClick={this.onCloseButtonClick}>
            <Cross />
          </Button>
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
};

Lightbox.defaultProps = {
  display: true,
  big: false,
  fullscreen: false,
};
