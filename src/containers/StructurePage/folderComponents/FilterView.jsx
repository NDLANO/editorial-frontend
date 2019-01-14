import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { injectT } from '@ndla/i18n';
import {
  StyledFilterButton,
  StyledFilterHeading,
} from '../../../style/LearningResourceTaxonomyStyles';

const Wrapper = styled('div')`
  display: flex;
  margin-left: auto;
`;

const FilterView = ({
  subjectFilters = [],
  t,
  activeFilters,
  toggleFilter,
}) => (
  <Wrapper>
    <StyledFilterHeading show>
      {t('taxonomy.topics.filterTopic')}:
    </StyledFilterHeading>
    {subjectFilters.map(filter => (
      <StyledFilterButton
        type="button"
        key={filter.id}
        className={
          activeFilters.find(filterId => filterId === filter.id)
            ? 'checkboxItem--checked'
            : ''
        }
        onClick={() => toggleFilter(filter.id)}>
        <span />
        <span>{filter.name}</span>
      </StyledFilterButton>
    ))}
  </Wrapper>
);

FilterView.propTypes = {
  subjectFilters: PropTypes.arrayOf(PropTypes.object),
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  toggleFilter: PropTypes.func,
};

export default injectT(FilterView);
