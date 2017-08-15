import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'slate';

const PlainTextEditor = ({ onChange, value, ...rest }) =>
  <Editor state={value} onChange={onChange} {...rest} />;

PlainTextEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape({
    _immutable: PropTypes.object,
  }).isRequired,
};

export default PlainTextEditor;
