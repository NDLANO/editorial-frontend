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
import SlateBlockPicker from './plugins/SlateBlockPicker';
import SlateToolbar from './plugins/SlateToolbar/SlateToolbar';

const classes = new BEMHelper({
  name: 'learning-resource-form',
  prefix: 'c-',
});

const editorClasses = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

class RichBlockTextEditor extends Component {
  constructor(props) {
    super(props);
    this.onContentChange = this.onContentChange.bind(this);
    this.toggleMark = this.toggleMark.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.state = {
      activeEditor: 0,
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
      activeEditor: index,
    });

    onChange(changedState);
  }

  onKeyDown(e, data, state, index) {
    if (!data.isMod) return;
    let mark;
    switch (data.key) {
      case 'b':
        mark = 'bold';
        break;
      case 'i':
        mark = 'italic';
        break;
      case 'u':
        mark = 'underlined';
        break;
      default:
    }
    if (mark) {
      this.toggleMark(e, state, mark, index);
    }
  }

  toggleMark(e, state, type, index) {
    e.preventDefault();
    const nextState = state.transform().toggleMark(type).apply();
    this.onContentChange(nextState, index);
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
            onClick={this.focus}
            tabIndex={index}>
            <SlateToolbar
              state={val.state}
              onChange={onChange}
              handleBlockContentChange={this.onContentChange}
              index={index}
              name={name}
            />
            <Editor
              {...editorClasses()}
              state={val.state}
              schema={schema}
              onChange={editorState => this.onContentChange(editorState, index)}
              onBeforeInput={(e, d, state) => state}
              onKeyDown={(evt, data, state) =>
                this.onKeyDown(evt, data, state, index)}
              {...rest}
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
