/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import ToggleSwitch from './ToggleSwitch';
import {
  RESOURCE_FILTER_CORE,
  RESOURCE_FILTER_SUPPLEMENTARY,
} from '../../../constants';

const classes = new BEMHelper({
  name: 'connectFilter',
  prefix: 'c-',
});

const ConnectFilterItem = ({ id, name, inputValues, onChange }) => {
  const relevance =
    inputValues.relevance === undefined
      ? true
      : inputValues.relevance === RESOURCE_FILTER_CORE;
  return (
    <div {...classes('')}>
      <label {...classes('item')}>
        <input
          {...classes('checkbox')}
          type="checkbox"
          name={`${id}-active`}
          checked={inputValues.active || false}
          onChange={() => onChange({ active: !inputValues.active })}
        />
        {name}
      </label>
      <ToggleSwitch
        onClick={() =>
          onChange({
            relevance: relevance
              ? RESOURCE_FILTER_SUPPLEMENTARY
              : RESOURCE_FILTER_CORE,
          })
        }
        on={relevance}
        testId={`${id}-relevance`}
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
