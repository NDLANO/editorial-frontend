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
import Types from 'slate-prop-types';
import { setActiveNode } from '../../createSlateStore';
import { EditorShape } from '../../../../shapes';

// Todo: a -> button
/* eslint jsx-a11y/no-static-element-interactions: 1 */

class Footnote extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
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
      // This state value seems not to be in use, not sure if we should remove it.
      /* eslint-disable-next-line react/no-unused-state */
      showFootnoteDialog: slateStore.getState().showFootnoteDialog,
    });
  }

  handleClick() {
    const { editor: { props: { slateStore } }, node } = this.props;
    slateStore.dispatch(setActiveNode(node));
  }

  render() {
    const { attributes, children } = this.props;
    return (
      <a
        {...attributes}
        role="link"
        tabIndex={0}
        onKeyPress={this.handleClick}
        onClick={this.handleClick}>
        <sup>{children}</sup>
      </a>
    );
  }
}

Footnote.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  editor: EditorShape,
  node: Types.node.isRequired,
};

export default injectT(Footnote);
