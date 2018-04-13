import React from 'react';
import BEMHelper from 'react-bem-helper';

const classes = new BEMHelper({
  name: 'toggleSwitch',
  prefix: 'c-',
});

const ToggleSwitch = ({ on, onClick }) => (
  <label {...classes('')}>
    <input name="relavance" checked={on} onClick={onClick} type="checkbox" />
    <span {...classes('slider')} />
  </label>
);

export default ToggleSwitch;
