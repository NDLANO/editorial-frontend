/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'slate';
import BEMHelper from 'react-bem-helper';
import { schema } from './schema';

const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

class SlateEditor extends Component {
  constructor(props) {
    super(props);
    this.focus = this.focus.bind(this);
  }

  onChange(editorState) {
    this.setState({ editorState });
  }

  focus() {
    this.editor.focus();
  }

  render() {
    const { children, className, value, onChange, ...rest } = this.props;
    return (
      <article>
        <div {...classes(undefined, className)} onClick={this.focus}>
          <Editor
            state={value}
            schema={schema}
            onChange={onChange}
            ref={element => {
              this.editor = element;
            }}
            {...rest}
          />
          {children}
        </div>
      </article>
    );
  }
}

SlateEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape({}).isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default SlateEditor;
