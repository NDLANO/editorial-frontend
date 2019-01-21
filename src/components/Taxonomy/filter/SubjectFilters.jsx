/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { StyledSubjectName } from '../../../style/LearningResourceTaxonomyStyles';
import FilterItem from './FilterItem';

const SubjectFilters = ({
  filter,
  availableFilters,
  structure,
  updateFilter,
  resourceId,
  isFirstSubject,
  filterSubjectKey,
}) => {
  const subject = structure.find(
    structureItem => structureItem.id === filterSubjectKey,
  );

  if (!subject) {
    return null;
  }

  return (
    <Fragment>
      <tr>
        <td>
          <StyledSubjectName firstSubject={isFirstSubject}>
            {subject.name}:
          </StyledSubjectName>
        </td>
      </tr>
      {availableFilters[filterSubjectKey].map(currentFilter => (
        <FilterItem
          key={currentFilter.id}
          currentFilter={currentFilter}
          activeFilters={filter}
          resourceId={resourceId}
          updateFilter={updateFilter}
        />
      ))}
    </Fragment>
  );
};

SubjectFilters.defaultProps = {
  isFirstSubject: false,
};

SubjectFilters.propTypes = {
  filterSubjectKey: PropTypes.string.isRequired,
  availableFilters: PropTypes.objectOf(PropTypes.array),
  filter: PropTypes.arrayOf(PropTypes.shape({})),
  structure: PropTypes.arrayOf(PropTypes.object),
  updateFilter: PropTypes.func,
  resourceId: PropTypes.string,
  isFirstSubject: PropTypes.bool,
};

export default SubjectFilters;
