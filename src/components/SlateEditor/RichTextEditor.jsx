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

const RichTextEditor = props => {
  const { schema, children, className, value, name, onChange, ...rest } = props;

  return (
    <article>
      <div {...classes(undefined, className)}>
        <SlateToolbar state={value} onChange={onChange} name={name} />
        <Editor
          state={value}
          schema={schema}
          onChange={state => onChange({ target: { name, value: state } })}
          {...rest}
        />
        {children}
      </div>
    </article>
  );
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
