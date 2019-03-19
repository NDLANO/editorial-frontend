/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { spacing, colors } from '@ndla/core';
import styled from 'react-emotion';
import ToggleSwitch from '../../../components/ToggleSwitch';
import {
  RESOURCE_FILTER_CORE,
  RESOURCE_FILTER_SUPPLEMENTARY,
} from '../../../constants';

const ConnectFilterItem = ({ id, name, inputValues, onChange }) => {
  const relevance =
    inputValues.relevance === undefined
      ? true
      : inputValues.relevance === RESOURCE_FILTER_CORE;
  return (
    <StyledFilterItem data-cy="connectFilterItem">
      <StyledLabel>
        <StyledCheckbox
          type="checkbox"
          name={`${id}-active`}
          checked={inputValues.active || false}
          onChange={() => onChange({ active: !inputValues.active })}
        />
        {name}
      </StyledLabel>
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
    </StyledFilterItem>
  );
};

const StyledFilterItem = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
`;

const StyledLabel = styled('label')`
  display: flex;
  margin: calc(${spacing.small} / 2);
  align-items: center;
  color: ${colors.grey};
`;

const StyledCheckbox = styled('input')`
  width: auto;
  margin-right: calc(${spacing.small} / 2);
  -webkit-appearance: checkbox !important;
  -moz-appearance: checkbox !important;
  padding: inital;
`;

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
