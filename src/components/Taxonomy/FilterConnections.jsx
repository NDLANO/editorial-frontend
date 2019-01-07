import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormHeader } from '@ndla/forms';
import { injectT } from '@ndla/i18n';
import {
  FilterTable,
  SubjectName,
} from '../../style/LearningResourceTaxonomyStyles';
import FilterItem from './FilterItem';

/* subjects,
filters, */

const FilterConnections = ({
  t,
  topics,
  filter,
  availableFilters,
  structure,
  updateFilter,
  resourceId,
}) => {
  const availableSubjects = {};
  topics.forEach(topic => {
    const parentSubject = topic.path.split('/')[1];
    availableSubjects[`urn:${parentSubject}`] = true;
  });
  return (
    <Fragment>
      <FormHeader
        title={t('taxonomy.filters.title')}
        subTitle={t('taxonomy.filters.subTitle')}
      />
      <FilterTable>
        <tbody>
          {Object.keys(availableSubjects).map((filterSubjectKey, index) => {
            const subject = structure.find(
              structureItem => structureItem.id === filterSubjectKey,
            );
            if (!subject) {
              return null;
            }
            return (
              <Fragment key={filterSubjectKey}>
                <tr>
                  <td>
                    <SubjectName firstSubject={index === 0}>
                      {subject.name}:
                    </SubjectName>
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
          })}
        </tbody>
      </FilterTable>
    </Fragment>
  );
};

FilterConnections.propTypes = {
  availableFilters: PropTypes.objectOf(PropTypes.array),
  filter: PropTypes.arrayOf(PropTypes.shape({})),
  topics: PropTypes.arrayOf(PropTypes.shape({})),
  structure: PropTypes.arrayOf(PropTypes.object),
  updateFilter: PropTypes.func,
  resourceId: PropTypes.string,
};

export default injectT(FilterConnections);
