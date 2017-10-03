import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';

const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

const EditorErrorMessage = ({ msg, attributes, children }) => (
  <div {...classes('error')} {...attributes}>
    <span>{msg}</span>
    {children}
  </div>
);

EditorErrorMessage.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  msg: PropTypes.string.isRequired,
};

export default EditorErrorMessage;
