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
import SlateToolbar from './plugins/SlateToolbar/SlateToolbar';

const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

const RichTextEditor = class extends React.Component {
  constructor(props) {
    super(props);
    this.toggleMark = this.toggleMark.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
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
          <Editor
            {...classes(undefined, className)}
            state={value}
            schema={schema}
            onKeyDown={this.onKeyDown}
            onChange={state => onChange({ target: { name, value: state } })}
            {...rest}
          />
          {children}
        </div>
        <SlateToolbar state={value} onChange={onChange} name={name} />
      </article>
    );
  }
};

RichTextEditor.propTypes = {
  schema: PropTypes.shape({}),
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default RichTextEditor;
