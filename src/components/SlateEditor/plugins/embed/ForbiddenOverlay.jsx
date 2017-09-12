import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';

const classes = new BEMHelper({
  name: 'content',
  prefix: 'c-',
});

const ForbiddenOverlay = ({ text }) =>
  <div>
    <div {...classes('forbidden-overlay')} />
    <div {...classes('forbidden-sign')} />
    <strong {...classes('forbidden-text')}>
      {text}
    </strong>
  </div>;

ForbiddenOverlay.propTypes = {
  text: PropTypes.string,
};

export default ForbiddenOverlay;
