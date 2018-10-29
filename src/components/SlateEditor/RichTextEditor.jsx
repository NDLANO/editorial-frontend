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
import { isKeyHotkey } from 'is-hotkey';
import BEMHelper from 'react-bem-helper';
import createSlateStore, { setSubmitted } from './createSlateStore';
import SlateToolbar from './plugins/SlateToolbar/SlateToolbar';
import { PluginShape } from '../../shapes';

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');

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
  }

  componentDidUpdate() {
    const { slateStore } = this.state;
    const { submitted } = this.props;
    if (submitted !== slateStore.getState().submitted) {
      slateStore.dispatch(setSubmitted(submitted));
    }
  }

  onKeyDown(e, change) {
    let mark;
    const { value } = change;

    if (isBoldHotkey(e)) {
      mark = 'bold';
    } else if (isItalicHotkey(e)) {
      mark = 'italic';
    } else if (isUnderlinedHotkey(e)) {
      mark = 'underlined';
    } else if (e.key === 'Backspace') {
      const { selection } = value;
      const numberOfNodesInSection = value.document.nodes.first().nodes.size;
      if (
        numberOfNodesInSection === 1 &&
        value.document.text.length === 0 &&
        selection.isCollapsed &&
        selection.anchor.isAtStartOfNode(value.document)
      ) {
        this.props.removeSection(this.props.index);
      }
    }

    if (mark) {
      this.toggleMark(e, value, mark);
    }
  }

  toggleMark(e, value, type) {
    const { name, onChange } = this.props;
    e.preventDefault();
    const nextChange = value.change().toggleMark(type);
    onChange({ target: { name, value: nextChange.value } });
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
        <div data-cy="slate-editor" style={{ position: 'relative' }}>
          <Editor
            {...classes(undefined, undefined, className)}
            onKeyDown={this.onKeyDown}
            value={value}
            schema={schema}
            onChange={change =>
              onChange({ target: { name, value: change.value } })
            }
            slateStore={this.state.slateStore}
            plugins={plugins}
            {...rest}
          />
          {children}
        </div>
        <SlateToolbar
          value={value}
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
