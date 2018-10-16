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
import EditFootnote from './EditFootnote';
import { EditorShape } from '../../../../shapes';

// Todo: a -> button
/* eslint jsx-a11y/no-static-element-interactions: 1 */

class Footnote extends Component {
  constructor() {
    super();
    this.state = { editMode: false };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({ editMode: !prevState.editMode }));
  }

  render() {
    const { attributes, children, value } = this.props;
    const { editMode } = this.state;
    return (
      <React.Fragment>
        <a
          {...attributes}
          role="link"
          tabIndex={0}
          onKeyPress={this.handleClick}
          onClick={this.handleClick}>
          <sup>{children}</sup>
        </a>
        {editMode && (
          <EditFootnote
            value={value}
            blur={value.editor.blur}
            onChange={value.editor.onChange}
          />
        )}
      </React.Fragment>
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
