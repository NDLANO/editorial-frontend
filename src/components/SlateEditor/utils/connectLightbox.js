/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { getComponentName } from 'ndla-util';
import { Portal } from '../../Portal';
import Lightbox from '../../Lightbox';
import { setActiveNode } from '../createSlateStore';

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
      this.closeAndReturnFocusToEditor = this.closeAndReturnFocusToEditor.bind(
        this,
      );
    }

    componentDidMount() {
      const { slateStore } = this.props;
      console.log(slateStore);
      this.unsubscribe = slateStore.subscribe(this.onStoreChange);
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    onStoreChange() {
      const { slateStore } = this.props;
      const node = slateStore.getState().activeNode;
      console.log('connect lgihtbox');
      console.log(node);
      console.log(node.type, this.nodeType);
      this.setState({
        node: node && node.type === this.nodeType ? node : undefined,
      });
    }

    closeAndReturnFocusToEditor() {
      const { onChange, value } = this.props;
      onChange(value.change().focus());
      this.handleClose();
    }

    handleClose() {
      const { slateStore } = this.props;
      slateStore.dispatch(setActiveNode(undefined));
    }

    render() {
      const { onChange, value, blur } = this.props;
      const { node } = this.state;

      return (
        <Portal isOpened={node !== undefined}>
          <Lightbox display big onClose={this.closeAndReturnFocusToEditor}>
            <WrappedComponent
              node={node}
              closeDialog={this.handleClose}
              value={value}
              blur={blur}
              handleValueChange={onChange}
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
    value: PropTypes.shape({}).isRequired,
    onChange: PropTypes.func.isRequired,
    blur: PropTypes.func.isRequired,
  };

  ConnectLightbox.displayName = `connectLightbox(${getComponentName(
    WrappedComponent,
  )})`;
  return hoistNonReactStatics(ConnectLightbox, WrappedComponent);
};

export default makeWrapper;
