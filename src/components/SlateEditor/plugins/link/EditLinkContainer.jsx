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
import Lightbox from '../../../Lightbox';
import { setFootnote } from '../../createSlateStore';
import EditLink from './EditLink';
import { TYPE } from './';

class EditFootnoteContainer extends Component {
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
    const node = slateStore.getState().selectedFootnote;
    this.setState({
      node: node && node.type === TYPE ? node : undefined,
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
      <Portal isOpened={node !== undefined}>
        <Lightbox display big onClose={this.handleClose}>
          <EditLink
            node={node}
            closeDialog={this.handleClose}
            state={state}
            blur={blur}
            handleStateChange={onChange}
          />
        </Lightbox>
      </Portal>
    );
  }
}

EditFootnoteContainer.propTypes = {
  slateStore: PropTypes.shape({
    getState: PropTypes.func.isRequired,
    subscribe: PropTypes.func.isRequired,
  }).isRequired,
  state: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  blur: PropTypes.func.isRequired,
};

export default injectT(EditFootnoteContainer);
