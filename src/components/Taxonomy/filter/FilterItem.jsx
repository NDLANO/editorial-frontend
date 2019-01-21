/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Additional, Core } from '@ndla/icons/common';
import { injectT } from '@ndla/i18n';
import {
  flexButtonCenterAlignStyle,
  StyledRelevanceButton,
  StyledFilterCheckBox,
  StyledFilterListTableRow,
} from '../../../style/LearningResourceTaxonomyStyles';
import {
  RESOURCE_FILTER_CORE,
  RESOURCE_FILTER_SUPPLEMENTARY,
} from '../../../constants';
import { FilterShape } from '../../../shapes';

const FilterItem = ({
  t,
  currentFilter,
  activeFilters,
  resourceId,
  updateFilter,
}) => {
  const useFilter = activeFilters.find(
    resourceFilter => resourceFilter.id === currentFilter.id,
  );
  const active = useFilter !== undefined;

  return (
    <StyledFilterListTableRow key={currentFilter.id} active={active}>
      <td>
        <StyledFilterCheckBox
          type="button"
          onClick={() =>
            updateFilter(currentFilter, RESOURCE_FILTER_CORE, active)
          }
          className={active ? 'checkboxItem--checked' : ''}>
          <span />
          <span>{currentFilter.name}</span>
        </StyledFilterCheckBox>
      </td>
      <td>
        <div css={flexButtonCenterAlignStyle}>
          <StyledRelevanceButton
            type="button"
            selected={
              useFilter &&
              useFilter.relevanceId === RESOURCE_FILTER_SUPPLEMENTARY
            }
            onClick={() =>
              updateFilter(currentFilter, RESOURCE_FILTER_SUPPLEMENTARY)
            }>
            <Additional className="c-icon--22" />{' '}
            {t('taxonomy.filters.additional')}
          </StyledRelevanceButton>
          <StyledRelevanceButton
            type="button"
            selected={
              useFilter && useFilter.relevanceId === RESOURCE_FILTER_CORE
            }
            onClick={() => updateFilter(currentFilter, RESOURCE_FILTER_CORE)}>
            <Core className="c-icon--22" /> {t('taxonomy.filters.core')}
          </StyledRelevanceButton>
        </div>
      </td>
    </StyledFilterListTableRow>
  );
};

FilterItem.propTypes = {
  currentFilter: FilterShape,
  activeFilters: PropTypes.arrayOf(FilterShape),
  updateFilter: PropTypes.func,
  resourceId: PropTypes.string,
};

export default injectT(FilterItem);
