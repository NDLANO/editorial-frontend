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
import { hasNodeOfType } from './utils';
import createSlateStore, { setSubmitted } from './createSlateStore';
import { PluginShape } from '../../shapes';

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isCodeHotKey = isKeyHotkey('mod+k');
const isCodeBlockHotKey = isKeyHotkey('mod+shift+k');
const isH2HotKey = isKeyHotkey('mod+2');
const isH3HotKey = isKeyHotkey('mod+3');
const isLinkHotKey = isKeyHotkey('mod+l');
const isMathHotKey = isKeyHotkey('mod+m');
const isSaveHotkey = isKeyHotkey('mod+s');

export const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

const slateEditorDivStyle = css`
  position: relative;
`;

const DEFAULT_NODE = 'paragraph';

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
    let block;
    let inline;
    const { value } = editor;

    if (isBoldHotkey(e)) {
      mark = 'bold';
    } else if (isItalicHotkey(e)) {
      mark = 'italic';
    } else if (isCodeHotKey(e)) {
      mark = 'code';
    } else if (isH2HotKey(e)) {
      block = 'heading-two';
    } else if (isH3HotKey(e)) {
      block = 'heading-three';
    } else if (isCodeBlockHotKey(e)) {
      block = 'code-block';
    } else if (isLinkHotKey(e)) {
      inline = 'link';
    } else if (isMathHotKey(e)) {
      inline = 'mathml';
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
    } else if (isSaveHotkey(e)) {
      e.preventDefault();
      this.props.handleSubmit();
    }

    if (mark) {
      e.preventDefault();
      editor.toggleMark(mark);
    } else {
      next();
    }
    if (block) {
      e.preventDefault();
      editor.setBlocks(hasNodeOfType(editor, block) ? DEFAULT_NODE : block);
    } else {
      next();
    }
    if (inline) {
      e.preventDefault();
      editor.withoutNormalizing(() => {
        editor.wrapInline(inline);
      });
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
  handleSubmit: PropTypes.func.isRequired,
};

export default RichTextEditor;
