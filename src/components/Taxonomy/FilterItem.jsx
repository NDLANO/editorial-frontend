import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { Additional, Core } from '@ndla/icons/common';
import {
  filterbuttonwrapper,
  FilterButton,
  FilterCheckBox,
  FilterListTR,
} from '../../style/LearningResourceTaxonomyStyles';
import {
  RESOURCE_FILTER_CORE,
  RESOURCE_FILTER_SUPPLEMENTARY,
} from '../../constants';

const FilterItem = ({ currentFilter, activeFilters, updateFilter, t }) => {
  const useFilter = activeFilters.find(
    resourceFilter => resourceFilter.id === currentFilter.id,
  );
  const active = useFilter !== undefined;
  return (
    <FilterListTR active={active}>
      <td>
        <FilterCheckBox
          type="button"
          onClick={() =>
            updateFilter(currentFilter, RESOURCE_FILTER_CORE, active)
          }
          className={active ? 'checkboxItem--checked' : ''}>
          <span />
          <span>{currentFilter.name}</span>
        </FilterCheckBox>
      </td>
      <td>
        <div className={filterbuttonwrapper}>
          <FilterButton
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
          </FilterButton>
          <FilterButton
            type="button"
            selected={
              useFilter && useFilter.relevanceId === RESOURCE_FILTER_CORE
            }
            onClick={() => updateFilter(currentFilter, RESOURCE_FILTER_CORE)}>
            <Core className="c-icon--22" /> {t('taxonomy.filters.core')}
          </FilterButton>
        </div>
      </td>
    </FilterListTR>
  );
};

FilterItem.propTypes = {
  currentFilter: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  activeFilters: PropTypes.array,
  updateFilter: PropTypes.func,
};

export default injectT(FilterItem);
