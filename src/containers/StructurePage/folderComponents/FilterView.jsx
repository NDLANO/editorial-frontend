import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { fonts, colors, spacing } from '@ndla/core';
import { injectT } from '@ndla/i18n';
import { StyledFilterButton } from '../../../style/LearningResourceTaxonomyStyles';

const Wrapper = styled('div')`
  display: flex;
  margin-left: auto;
`;

const StyledFilterHeading = styled('span')`
  ${fonts.sizes(16, 1.2)} font-weight: ${fonts.weight.semibold};
  text-transform: uppercase;
  color: ${colors.text.primary};
  opacity: ${props => (props.show ? 1 : 0)};
  display: flex;
  align-items: center;
  padding-right: ${spacing.small};
  white-space: nowrap;
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
        data-testid="filter-item"
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
