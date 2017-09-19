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
import BEMHelper from 'react-bem-helper';
import Portal from 'react-portal';
import SlateBlockPicker from './plugins/SlateBlockPicker';
import RichTextEditor from './RichTextEditor';
import { PluginShape } from '../../shapes';

const classes = new BEMHelper({
  name: 'learning-resource-form',
  prefix: 'c-',
});

class RichBlockTextEditor extends Component {
  constructor(props) {
    super(props);
    this.onContentChange = this.onContentChange.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(newState, index) {
    const { name, onChange, value } = this.props;
    const newValue = [].concat(value);
    newValue[index] = { state: newState, index };
    const changedState = {
      target: {
        value: newValue,
        name,
        type: 'SlateEditorState',
      },
    };

    onChange(changedState);
  }

  onContentChange(e, index) {
    this.onChange(e.target.value, index);
  }

  render() {
    const {
      schema,
      children,
      className,
      value,
      name,
      onChange,
      ingress,
      ingressRef,
      ...rest
    } = this.props;

    return (
      <article>
        {value.map((val, index) =>
          <div
            key={`editor_${index}`} //eslint-disable-line
            {...classes('container', 'no-padding')}
            tabIndex={index}>
            <RichTextEditor
              name={name}
              schema={schema}
              onChange={e => this.onContentChange(e, index)}
              {...rest}
              value={val.state}
            />
            <Portal isOpened>
              <SlateBlockPicker
                name={name}
                onChange={onChange}
                blocks={value}
                editorState={val}
                index={index}
                ingress={ingress}
                ingressRef={ingressRef}
                setFocus={this.setFocus}
              />
            </Portal>

            {children}
          </div>,
        )}
      </article>
    );
  }
}

RichBlockTextEditor.propTypes = {
  schema: PropTypes.shape({}),
  onChange: PropTypes.func.isRequired,
  ingressRef: PropTypes.shape({
    scrollIntoView: PropTypes.func.isRequired,
  }),
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  submitted: PropTypes.bool.isRequired,
  plugins: PropTypes.arrayOf(PluginShape).isRequired,
  ingress: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.object,
  }),
};

export default RichBlockTextEditor;
