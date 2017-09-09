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
import { Editor } from 'slate';
import BEMHelper from 'react-bem-helper';
import createSlateStore from './createSlateStore';
import SlateToolbar from './plugins/SlateToolbar/SlateToolbar';
import createEmbedPlugin from './embedPlugin';

const classes = new BEMHelper({
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
  }

  componentWillReceiveProps(nextProps) {
    const { slateStore } = this.state;
    if (nextProps.submitted !== slateStore.getState().submitted) {
      slateStore.dispatch({
        type: 'SET_SUBMITTED',
        payload: nextProps.submitted,
      });
    }
  }

  onKeyDown(e, data, state) {
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
      this.toggleMark(e, state, mark);
    }
  }

  toggleMark(e, state, type) {
    const { name, onChange } = this.props;
    e.preventDefault();
    const nextState = state.transform().toggleMark(type).apply();
    onChange({ target: { name, value: nextState } });
  }

  render() {
    const {
      schema,
      children,
      className,
      value,
      name,
      onChange,
      ...rest
    } = this.props;

    return (
      <article>
        <div>
          <SlateToolbar state={value} onChange={onChange} name={name} />
          <Editor
            {...classes(undefined, undefined, className)}
            state={value}
            plugins={[createEmbedPlugin()]}
            schema={schema}
            onKeyDown={this.onKeyDown}
            onChange={state => onChange({ target: { name, value: state } })}
            slateStore={this.state.slateStore}
            {...rest}
          />
          {children}
        </div>
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
};

export default RichTextEditor;
