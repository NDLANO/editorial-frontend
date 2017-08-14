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
import SlateBlockPicker from './SlateBlockPicker';

const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

class SlateEditor extends Component {
  constructor(props) {
    super(props);
    this.onContentChange = this.onContentChange.bind(this);
    this.state = {
      showTypePicker: { show: false, index: 0 },
    };
  }
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
    this.setState({
      showTypePicker: { show: state.endText.length === 0, index },
    });
    return onChange(changedState);
  }

  render() {
    const {
      children,
      className,
      value,
      name,
      onChange,
      ingress,
      ingressRef,
      ...rest
    } = this.props;
    if (Array.isArray(value)) {
      return (
        <article {...classes('article')}>
          {value.map((val, index) =>
            <div
              key={`editor_${index}`} //eslint-disable-line
              {...classes('container', className)}
              onClick={this.focus}
              tabIndex={index}>
              <Editor
                state={val.state}
                schema={schema}
                onChange={editorState =>
                  this.onContentChange(editorState, index)}
                onBeforeInput={(e, d, state) => state}
                {...rest}
              />
              <SlateBlockPicker
                name={name}
                onChange={onChange}
                blocks={value}
                showTypePicker={this.state.showTypePicker}
                index={index}
                ingress={ingress}
                ingressRef={ingressRef}
              />
              {children}
            </div>,
          )}
        </article>
      );
    }

    return (
      <article>
        <div {...classes(undefined, className)}>
          <Editor
            state={value}
            schema={schema}
            onChange={state => onChange({ target: { name, value: state } })}
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
  ingressRef: PropTypes.shape({
    scrollIntoView: PropTypes.func.isRequired,
  }),
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  ingress: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.object,
  }),
};

export default SlateEditor;
