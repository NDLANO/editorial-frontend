/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import Portal from 'react-portal';
import { setFootnote } from '../../createSlateStore';
import FootnoteLightbox from './FootnoteLightbox';

class Footnote extends Component {
  constructor() {
    super();
    this.state = {
      node: undefined,
    };
    this.handleClose = this.handleClose.bind(this);
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  componentWillMount() {
    const { slateStore } = this.props;
    this.unsubscribe = slateStore.subscribe(this.onStoreChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onStoreChange() {
    const { slateStore } = this.props;
    this.setState({
      node: slateStore.getState().selectedFootnote,
    });
  }

  handleClose() {
    const { slateStore } = this.props;
    slateStore.dispatch(setFootnote(undefined));
  }

  render() {
    const { onChange, state, blur } = this.props;
    const { node } = this.state;

    return (
      <Portal isOpened={this.state.node !== undefined}>
        <FootnoteLightbox
          node={node}
          blur={blur}
          handleStateChange={onChange}
          closeDialog={() => this.handleClose(false)}
          state={state}
        />
      </Portal>
    );
  }
}

Footnote.propTypes = {
  slateStore: PropTypes.shape({
    getState: PropTypes.func.isRequired,
    subscribe: PropTypes.func.isRequired,
  }).isRequired,
  state: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  blur: PropTypes.func.isRequired,
};

export default injectT(Footnote);
