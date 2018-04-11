import React from 'react';
import BEMHelper from 'react-bem-helper';

const classes = new BEMHelper({
  name: 'roundIcon',
  prefix: 'c-',
});

const RoundIcon = ({ icon, open, small, margin }) => {
  return (
    <div
      {...classes(
        '',
        `${open ? 'open' : ''} ${small ? 'small' : ''} ${
          margin ? 'margin' : ''
        }`,
      )}>
      {icon}
    </div>
  );
};

export default RoundIcon;
