import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import ToggleSwitch from './ToggleSwitch';

const classes = new BEMHelper({
  name: 'connectFilter',
  prefix: 'c-',
});

const ConnectFilterItem = ({
  id,
  name,
  active,
  relevanceId,
  inputValues,
  onChange,
}) => {
  const relevance =
    inputValues.relevance === undefined
      ? relevanceId === 'urn:relevance:core'
      : inputValues.relevance === 'urn:relevance:core';
  return (
    <div {...classes('')}>
      <label {...classes('item')}>
        <input
          {...classes('checkbox')}
          type="checkbox"
          name={`${id}-active`}
          checked={
            inputValues.active === undefined ? active : inputValues.active
          }
          onClick={() => onChange({ active: !inputValues.active })}
        />
        <div {...classes('label')}>{name}</div>
      </label>
      <ToggleSwitch
        onClick={() =>
          onChange({
            relevance: relevance
              ? 'urn:relevance:supplementary'
              : 'urn:relevance:core',
          })
        }
        on={!relevance}
      />
    </div>
  );
};

ConnectFilterItem.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  active: PropTypes.bool,
  relevanceId: PropTypes.string,
  inputValues: PropTypes.shape({
    relevance: PropTypes.string,
    active: PropTypes.bool,
  }),
  onChange: PropTypes.func,
};

export default ConnectFilterItem;
