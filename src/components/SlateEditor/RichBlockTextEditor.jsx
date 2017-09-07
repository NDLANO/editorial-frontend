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
import SlateBlockPicker from './plugins/SlateBlockPicker';
import RichTextEditor from './RichTextEditor';

const classes = new BEMHelper({
  name: 'learning-resource-form',
  prefix: 'c-',
});

class RichBlockTextEditor extends Component {
  constructor(props) {
    super(props);
    this.onContentChange = this.onContentChange.bind(this);
    this.onContentFocus = this.onContentFocus.bind(this);
    this.onContentBlur = this.onContentBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.setFocus = this.setFocus.bind(this);
    this.state = {
      activeEditor: { index: -1, hasFocus: false },
    };
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
    this.setState({
      activeEditor: { index, hasFocus: true },
    });

    onChange(changedState);
  }

  onContentChange(e, index) {
    this.onChange(e.target.value, index);
  }

  onContentFocus(index, state) {
    this.onChange(
      state.transform().collapseToEndOf(state.endBlock).focus().apply(),
      index,
    );
    this.setFocus(index);
  }
  onContentBlur(index, state) {
    this.onChange(state.transform().blur().apply(), index);
    this.setState({
      activeEditor: { index, hasFocus: false },
    });
  }
  setFocus(index) {
    this.setState({
      activeEditor: { index, hasFocus: true },
    });
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
            {...classes('container', className)}
            onClick={this.onClig}
            tabIndex={index}
            onFocus={() => this.onContentFocus(index, val.state)}
            onBlur={() => this.onContentBlur(index, val.state)}>
            <RichTextEditor
              name={name}
              schema={schema}
              onChange={e => this.onContentChange(e, index)}
              {...rest}
              value={val.state}
            />
            <SlateBlockPicker
              name={name}
              onChange={onChange}
              blocks={value}
              state={val}
              activeEditor={this.state.activeEditor}
              index={index}
              ingress={ingress}
              ingressRef={ingressRef}
              setFocus={this.setFocus}
            />
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
  ingress: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.object,
  }),
};

export default RichBlockTextEditor;
