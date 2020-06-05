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
import { css } from '@emotion/core';
import createSlateStore, { setSubmitted } from './createSlateStore';
import { PluginShape } from '../../shapes';

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');

export const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

const slateEditorDivStyle = css`
  position: relative;
`;

const RichTextEditor = class extends React.PureComponent {
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
    this.editorRef = React.createRef();
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidUpdate() {
    const { slateStore } = this.state;
    const { submitted } = this.props;
    if (submitted !== slateStore.getState().submitted) {
      slateStore.dispatch(setSubmitted(submitted));
    }
  }

  onChange(change) {
    const { onChange, name, index } = this.props;
    onChange(
      {
        target: {
          name,
          value: change.value,
          type: 'SlateEditorValue',
        },
      },
      index,
    );
  }

  onKeyDown(e, editor, next) {
    let mark;
    const { value } = editor;

    if (isBoldHotkey(e)) {
      mark = 'bold';
    } else if (isItalicHotkey(e)) {
      mark = 'italic';
    } else if (isUnderlinedHotkey(e)) {
      mark = 'underlined';
    } else if (e.key === 'Backspace') {
      const { removeSection, index } = this.props;
      if (removeSection) {
        const { selection } = value;
        const numberOfNodesInSection = value.document.nodes.first().nodes.size;
        if (
          numberOfNodesInSection === 1 &&
          value.document.text.length === 0 &&
          selection.isCollapsed &&
          selection.anchor.isAtStartOfNode(value.document)
        ) {
          removeSection(index);
          return;
        }
        next();
      }
    }

    if (mark) {
      e.preventDefault();
      editor.toggleMark(mark);
    } else {
      next();
    }
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
      index,
      ...rest
    } = this.props;
    return (
      <article>
        <div data-cy="slate-editor" css={slateEditorDivStyle}>
          <Editor
            {...classes('content', undefined, className)}
            onKeyDown={this.onKeyDown}
            ref={this.editorRef}
            value={value}
            name={name}
            schema={schema}
            onChange={this.onChange}
            slateStore={this.state.slateStore}
            plugins={plugins}
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
  index: PropTypes.number,
  removeSection: PropTypes.func,
  plugins: PropTypes.arrayOf(PluginShape).isRequired,
};

export default RichTextEditor;
