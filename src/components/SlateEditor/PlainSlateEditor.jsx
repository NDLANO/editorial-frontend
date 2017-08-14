import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'slate';

const PlainSlateEditor = ({ onChange, value, ...rest }) =>
  <Editor state={value} onChange={onChange} {...rest} />;

PlainSlateEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape({
    _immutable: PropTypes.object,
  }).isRequired,
};

export default PlainSlateEditor;
