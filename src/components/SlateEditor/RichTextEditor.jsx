/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'slate-react';
import BEMHelper from 'react-bem-helper';
import createSlateStore, { setSubmitted } from './createSlateStore';
import SlateToolbar from './plugins/SlateToolbar/SlateToolbar';
import { PluginShape } from '../../shapes';

export const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

const RichTextEditor = class extends React.Component {
  constructor(props) {
    super(props);
    // Need to use a observer pattern to notify slate nodes of
    // changes to editor props. Instead of implementing our own
    // observer we use a Redux store.
    // See: https://github.com/ianstormtaylor/slate/issues/763
    const slateStore = createSlateStore();
    this.state = {
      slateStore,
    };
    this.toggleMark = this.toggleMark.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { slateStore } = this.state;
    if (nextProps.submitted !== slateStore.getState().submitted) {
      slateStore.dispatch(setSubmitted(nextProps.submitted));
    }
  }

  onKeyDown(e, data, change) {
    let mark;
    const state = change.state;
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
      case 'backspace': {
        const selection = state.selection;
        if (
          state.document.text.length === 0 &&
          selection.isAtStartOf(state.document)
        ) {
          this.props.removeSection(this.props.index);
        }
        break;
      }
      default:
    }
    if (mark && data.isMod) {
      this.toggleMark(e, state, mark);
    }
  }

  toggleMark(e, state, type) {
    const { name, onChange } = this.props;
    e.preventDefault();
    const nextChange = state.change().toggleMark(type);
    onChange({ target: { name, value: nextChange.state } });
  }

  render() {
    const {
      schema,
      children,
      className,
      value,
      name,
      onChange,
      plugins,
      ...rest
    } = this.props;
    return (
      <article>
        <div>
          <Editor
            {...classes(undefined, undefined, className)}
            onKeyDown={this.onKeyDown}
            state={value}
            schema={schema}
            onChange={change =>
              onChange({ target: { name, value: change.state } })}
            slateStore={this.state.slateStore}
            plugins={plugins}
            {...rest}
          />
          {children}
        </div>
        <SlateToolbar
          state={value}
          onChange={onChange}
          slateStore={this.state.slateStore}
          name={name}
        />
      </article>
    );
  }
};

RichTextEditor.propTypes = {
  schema: PropTypes.shape({}),
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  submitted: PropTypes.bool.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  isBlock: PropTypes.bool,
  index: PropTypes.number,
  removeSection: PropTypes.func,
  plugins: PropTypes.arrayOf(PluginShape).isRequired,
};

export default RichTextEditor;
