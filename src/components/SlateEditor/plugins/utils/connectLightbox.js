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
import hoistNonReactStatics from 'hoist-non-react-statics';
import { getComponentName } from 'ndla-util';
import Lightbox from '../../../Lightbox';
import { setActiveNode } from '../../createSlateStore';

const makeWrapper = getNodeType => WrappedComponent => {
  class ConnectLightbox extends Component {
    constructor() {
      super();
      this.state = {
        node: undefined,
      };
      this.nodeType = getNodeType();
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
      const node = slateStore.getState().activeNode;
      this.setState({
        node: node && node.type === this.nodeType ? node : undefined,
      });
    }

    handleClose() {
      const { slateStore, blur, onChange, state } = this.props;
      const node = this.state.node;

      const properties = {
        data: { ...node.data.toJS() },
      };
      // const nextState = state.change().blur();
      const nextState = state.change().collapseToEnd();
      state.change().setNodeByKey(node.key, properties);
      console.log('close');
      onChange(nextState);
      // blur();
      slateStore.dispatch(setActiveNode(undefined));
    }

    render() {
      const { onChange, state, blur } = this.props;
      const { node } = this.state;

      return (
        <Portal isOpened={node !== undefined}>
          <Lightbox display big onClose={this.handleClose}>
            <WrappedComponent
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

  ConnectLightbox.propTypes = {
    slateStore: PropTypes.shape({
      getState: PropTypes.func.isRequired,
      subscribe: PropTypes.func.isRequired,
    }).isRequired,
    state: PropTypes.shape({}).isRequired,
    onChange: PropTypes.func.isRequired,
    blur: PropTypes.func.isRequired,
  };

  ConnectLightbox.displayName = `connectLightbox(${getComponentName(
    WrappedComponent,
  )})`;
  return hoistNonReactStatics(ConnectLightbox, WrappedComponent);
};

export default makeWrapper;
