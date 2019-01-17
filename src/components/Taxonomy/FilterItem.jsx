import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { Additional, Core } from '@ndla/icons/common';
import {
  flexCenterAlign,
  StyledRelevanceButton,
  StyledFilterCheckBox,
  StyledFilterListTableRow,
} from '../../style/LearningResourceTaxonomyStyles';
import {
  RESOURCE_FILTER_CORE,
  RESOURCE_FILTER_SUPPLEMENTARY,
} from '../../constants';

const FilterItem = ({
  currentFilter,
  activeFilters,
  updateFilter,
  resourceId,
  t,
}) => {
  const useFilter = activeFilters.find(
    resourceFilter => resourceFilter.id === currentFilter.id,
  );
  const active = useFilter !== undefined;
  return (
    <StyledFilterListTableRow active={active}>
      <td>
        <StyledFilterCheckBox
          type="button"
          data-testid={`useFilterCheckbox-${currentFilter.id}`}
          onClick={() =>
            updateFilter(
              resourceId,
              currentFilter,
              RESOURCE_FILTER_CORE,
              active,
            )
          }
          className={active ? 'checkboxItem--checked' : ''}>
          <span />
          <span>{currentFilter.name}</span>
        </StyledFilterCheckBox>
      </td>
      <td>
        <div className={flexCenterAlign}>
          <StyledRelevanceButton
            type="button"
            data-testid={`selectCoreRelevance-${currentFilter.id}`}
            selected={
              useFilter &&
              useFilter.relevanceId === RESOURCE_FILTER_SUPPLEMENTARY
            }
            onClick={() =>
              updateFilter(
                resourceId,
                currentFilter,
                RESOURCE_FILTER_SUPPLEMENTARY,
              )
            }>
            <Additional className="c-icon--22" />{' '}
            {t('taxonomy.filters.additional')}
          </StyledRelevanceButton>
          <StyledRelevanceButton
            type="button"
            data-testid={`selectSupplementaryRelevance-${currentFilter.id}`}
            selected={
              useFilter && useFilter.relevanceId === RESOURCE_FILTER_CORE
            }
            onClick={() =>
              updateFilter(resourceId, currentFilter, RESOURCE_FILTER_CORE)
            }>
            <Core className="c-icon--22" /> {t('taxonomy.filters.core')}
          </StyledRelevanceButton>
        </div>
      </td>
    </StyledFilterListTableRow>
  );
};

FilterItem.propTypes = {
  currentFilter: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  activeFilters: PropTypes.array,
  updateFilter: PropTypes.func,
  resourceId: PropTypes.string,
};

export default injectT(FilterItem);
