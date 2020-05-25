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
import { FilterShape, StructureShape, TopicShape } from '../../../shapes';
import Breadcrumb from '../Breadcrumb';

const SubjectFilters = ({
  activeFilters,
  availableFilters,
  structure,
  updateFilter,
  resourceId,
  isFirstSubject,
  filterSubjectKey,
  breadCrumb,
}) => {
  const subject = structure.find(
    structureItem => structureItem.id === filterSubjectKey,
  );

  if (!subject || !availableFilters[filterSubjectKey]) {
    return null;
  }
  return (
    <Fragment>
      <tr>
        <td colSpan="2">
          {breadCrumb ? (
            <Breadcrumb breadcrumb={breadCrumb} />
          ) : (
            <StyledSubjectName firstSubject={isFirstSubject}>
              {subject.name}
            </StyledSubjectName>
          )}
        </td>
      </tr>
      {availableFilters[filterSubjectKey].map(currentFilter => (
        <FilterItem
          key={currentFilter.id}
          currentFilter={currentFilter}
          activeFilters={activeFilters}
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
  availableFilters: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string,
        subjectId: PropTypes.string,
      }),
    ),
  ),
  activeFilters: PropTypes.arrayOf(FilterShape),
  structure: PropTypes.arrayOf(StructureShape),
  updateFilter: PropTypes.func,
  resourceId: PropTypes.string,
  isFirstSubject: PropTypes.bool,
  breadCrumb: TopicShape,
};

export default SubjectFilters;
