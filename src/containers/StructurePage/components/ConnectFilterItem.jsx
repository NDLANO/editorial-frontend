import React from 'react';
import PropTypes from 'prop-types';

const ConnectFilterItem = ({ name, active, classes }) => {
  return (
    <div {...classes('filterItem')}>
      <label>
        <input type="checkbox" checked={active} />
        {name}
      </label>
    </div>
  );
};

ConnectFilterItem.propTypes = {};

export default ConnectFilterItem;
