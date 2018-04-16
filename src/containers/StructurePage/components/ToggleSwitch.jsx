import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';

const classes = new BEMHelper({
  name: 'toggleSwitch',
  prefix: 'c-',
});

const ToggleSwitch = ({ on, onClick, testId }) => (
  <label {...classes('')}>
    <input
      data-testid={testId}
      checked={on}
      onChange={onClick}
      type="checkbox"
    />
    <span {...classes('slider')} />
  </label>
);

ToggleSwitch.propTypes = {
  on: PropTypes.bool,
  onClick: PropTypes.func,
  testId: PropTypes.string,
};

export default ToggleSwitch;
