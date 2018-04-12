import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';

const classes = new BEMHelper({
  name: 'roundIcon',
  prefix: 'c-',
});

const RoundIcon = ({ icon, open, small, margin }) => (
  <div
    {...classes(
      '',
      `${open ? 'open' : ''} ${small ? 'small' : ''} ${margin ? 'margin' : ''}`,
    )}>
    {icon}
  </div>
);

RoundIcon.propTypes = {
  icon: PropTypes.node,
  open: PropTypes.bool,
  small: PropTypes.bool,
  margin: PropTypes.bool,
};

export default RoundIcon;
