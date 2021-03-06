/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Types from 'slate-prop-types';
import EditFootnote from './EditFootnote';
import { EditorShape } from '../../../../shapes';

// Todo: a -> button
/* eslint jsx-a11y/no-static-element-interactions: 1 */

class Footnote extends Component {
  constructor(props) {
    super(props);

    const existingFootnote = props.node.data ? props.node.data.toJS() : {};
    this.state = { editMode: !existingFootnote.title };
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  toggleEditMode() {
    this.setState(prevState => ({ editMode: !prevState.editMode }));
  }

  render() {
    const { attributes, children, editor, node } = this.props;
    const { editMode } = this.state;
    const existingFootnote = node.data ? node.data.toJS() : {};
    return (
      <React.Fragment>
        <a
          {...attributes}
          role="link"
          tabIndex={0}
          onKeyPress={this.toggleEditMode}
          onClick={this.toggleEditMode}>
          <sup>{children}</sup>
        </a>
        {editMode && (
          <EditFootnote
            editor={editor}
            node={node}
            existingFootnote={existingFootnote}
            blur={editor.blur}
            closeDialog={this.toggleEditMode}
            onChange={editor.onChange}
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
  value: Types.value.isRequired,
  node: Types.node.isRequired,
};

export default injectT(Footnote);
