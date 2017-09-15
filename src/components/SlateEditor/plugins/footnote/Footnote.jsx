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
import FootnoteLightbox from './FootnoteLightbox';
import { EditorShape, NodeShape } from '../../../../shapes';

class Footnote extends Component {
  constructor() {
    super();
    this.state = {};
    this.toogleFootnoteLightbox = this.toogleFootnoteLightbox.bind(this);
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  componentWillMount() {
    const { editor: { props: { slateStore } } } = this.props;
    this.unsubscribe = slateStore.subscribe(this.onStoreChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onStoreChange() {
    const { editor: { props: { slateStore } } } = this.props;
    this.setState({
      showFootnoteDialog: slateStore.getState().showFootnoteDialog,
    });
  }

  toogleFootnoteLightbox(payload) {
    const { editor: { props: { slateStore } } } = this.props;
    slateStore.dispatch({
      type: 'SHOW_FOOTNOTE',
      payload,
    });
  }

  render() {
    const { editor, node, state, attributes, children } = this.props;

    return (
      <a {...attributes} onClick={() => this.toogleFootnoteLightbox(true)}>
        <Portal isOpened={this.state.showFootnoteDialog} onOpen={this.onOpen}>
          <FootnoteLightbox
            node={node}
            handleStateChange={editor.onChange}
            closeDialog={() => this.toogleFootnoteLightbox(false)}
            state={state}
          />
        </Portal>
        <sup>
          {children}
        </sup>
      </a>
    );
  }
}

Footnote.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  editor: EditorShape,
  state: PropTypes.shape({}),
  node: NodeShape,
};

export default injectT(Footnote);
