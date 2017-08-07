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
import { uuid } from 'ndla-util';
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
    this.onContentChange = this.onContentChange.bind(this);
  }
te
  onContentChange(state, index) {
    const { name, onChange, value } = this.props;
    const newValue = [].concat(value);
    newValue[index] = { state, index };
    const changedState = {
      target: {
        value: newValue,
        name,
        type: 'SlateEditorState',
      },
    };
    return onChange(changedState);
  }

  focus() {
    this.editor.focus();
  }

  render() {
    const { children, className, value, name, onChange, ...rest } = this.props;
    if (Array.isArray(value)) {
      return (
        <article>
          {value.map((val, index) =>
            <div
              key={uuid()}
              {...classes(undefined, className)}
              onClick={this.focus}>
              <Editor
                state={val.state}
                schema={schema}
                onChange={(editorState) => this.onContentChange(editorState, index)}
                onBeforeInput={(e, d, state) => state}
                ref={element => {
                  this.editor = element;
                }}
                {...rest}
              />
              {children}
            </div>,
          )}
        </article>
      );
    }

    return (
      <article>
        <div
          {...classes(undefined, className)}
          >
          <Editor
            state={value}
            schema={schema}
            onChange={(state) => onChange({target: { name, value: state}})}
            ref={element => {
              this.editor = element;
            }}
            {...rest}
          />
          {children}
        </div>
      </article>
    )
  }
}

SlateEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default SlateEditor;
