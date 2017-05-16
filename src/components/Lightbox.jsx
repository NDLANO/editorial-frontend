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

const classes = new BEMHelper({
  name: 'lightbox',
  prefix: 'c-',
});

export default class Lightbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { display: props.display };
    this.onCloseButtonClick = this.onCloseButtonClick.bind(this);
  }

  componentWillReceiveProps(props) {
    const { display } = props;
    this.setState({ display });
  }

  onCloseButtonClick(evt) {
    this.setState({ display: false }, () => this.props.onClose());
    evt.preventDefault();
  }

  render() {
    const { children, big, width } = this.props;
    const modifiers = {
      big,
    };

    const style = width ? { maxWidth: width } : undefined;

    return this.state.display ? <div {...classes()} >
      <div {...classes('content', modifiers)} style={style}>
        <Button {...classes('close')} stripped onClick={this.onCloseButtonClick}>
          <svg className="icon" viewBox="0 0 24 24" width="100%" height="100%">
            <title>close</title>
            <path className="path1" d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z" />
          </svg>
        </Button>
        {children}
      </div>
    </div> : null;
  }
}

Lightbox.propTypes = {
  onClose: PropTypes.func,
  display: PropTypes.bool,
  big: PropTypes.bool,
  width: PropTypes.string,
};

Lightbox.defaultProps = {
  display: true,
  big: false,
  onClose: () => {},
};
