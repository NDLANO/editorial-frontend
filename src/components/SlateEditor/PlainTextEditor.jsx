/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'slate-react';

const PlainTextEditor = ({ onChange, value, ...rest }) =>
  <Editor state={value} onChange={onChange} {...rest} />;

PlainTextEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape({
    _immutable: PropTypes.object,
  }).isRequired,
};

export default PlainTextEditor;
