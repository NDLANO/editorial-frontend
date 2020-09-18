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
import styled from '@emotion/styled';
import ToggleSwitch from '../../../components/ToggleSwitch';
import {
  RESOURCE_FILTER_CORE,
  RESOURCE_FILTER_SUPPLEMENTARY,
} from '../../../constants';
import { MetadataShape } from '../../../shapes';

const ConnectFilterItem = ({ id, name, metadata, inputValues, onChange }) => {
  const relevance =
    inputValues.relevance === undefined
      ? true
      : inputValues.relevance === RESOURCE_FILTER_CORE;
  return (
    <StyledFilterItem>
      <StyledLabel isVisible={metadata?.visible || true}>
        <StyledCheckbox
          type="checkbox"
          data-testid="connectFilterItem"
          name={`${id}-active`}
          checked={inputValues.active || true}
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
        testId="toggleRelevance"
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
  font-style: ${props => !props.isVisible && 'italic'};
  color: ${props =>
    !props.isVisible ? colors.brand.grey : colors.brand.primary};
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
  metadata: MetadataShape,
  active: PropTypes.bool,
  relevanceId: PropTypes.string,
  inputValues: PropTypes.shape({
    relevance: PropTypes.string,
    active: PropTypes.bool,
  }),
  onChange: PropTypes.func,
};

export default ConnectFilterItem;
