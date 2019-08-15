/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FieldHeader } from '@ndla/forms';
import { injectT } from '@ndla/i18n';
import { StyledFilterTable } from '../../../style/LearningResourceTaxonomyStyles';
import SubjectFilters from './SubjectFilters';
import { TopicShape, FilterShape, StructureShape } from '../../../shapes';
import HowToHelper from '../../HowTo/HowToHelper';

const FilterConnections = ({
  t,
  topics,
  activeFilters,
  availableFilters,
  structure,
  updateFilter,
  resourceId,
}) => {
  const availableSubjects = {};
  topics.forEach(topic => {
    if (topic.topicConnections) {
      topic.topicConnections.forEach(topicConnection => {
        availableSubjects[
          `urn:${topicConnection.paths[0].split('/')[1]}`
        ] = true;
      });
    } else {
      const parentSubject = topic.path.split('/')[1];
      availableSubjects[`urn:${parentSubject}`] = true;
    }
  });
  return (
    <Fragment>
      <FieldHeader
        title={t('taxonomy.filters.title')}
        subTitle={t('taxonomy.filters.subTitle')}>
        <HowToHelper
          pageId="TaxonomySubjectFilters"
          tooltip={t('taxonomy.filters.helpLabel')}
        />
      </FieldHeader>
      <StyledFilterTable>
        <tbody>
          {Object.keys(availableSubjects).map((filterSubjectKey, index) => (
            <SubjectFilters
              key={filterSubjectKey}
              isFirstSubject={index === 0}
              filterSubjectKey={filterSubjectKey}
              availableFilters={availableFilters}
              activeFilters={activeFilters}
              structure={structure}
              updateFilter={updateFilter}
              resourceId={resourceId}
            />
          ))}
        </tbody>
      </StyledFilterTable>
    </Fragment>
  );
};

FilterConnections.defaultProps = {
  topics: [],
};

FilterConnections.propTypes = {
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
  topics: PropTypes.arrayOf(TopicShape),
  structure: PropTypes.arrayOf(StructureShape),
  updateFilter: PropTypes.func,
  resourceId: PropTypes.string,
};

export default injectT(FilterConnections);
