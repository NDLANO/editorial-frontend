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
import {
  SubjectShape,
  TopicShape,
  FilterShape,
  AvailableFiltersShape,
  StructureShape,
} from '../../../shapes';
import HowToHelper from '../../HowTo/HowToHelper';

const FilterConnections = ({
  t,
  topics,
  pathObjects,
  activeFilters,
  availableFilters,
  structure,
  updateFilter,
  resourceId,
}) => {
  const availableSubjects = pathObjects?.map(name => name.subject.id) || [];
  if (topics) {
    topics.forEach(topic => {
      if (topic.paths) {
        topic.paths.forEach(path => {
          availableSubjects.push(`urn:${path.split('/')[1]}`);
        });
      } else {
        const parentSubject = topic.path.split('/')[1];
        availableSubjects.push(`urn:${parentSubject}`);
      }
    });
  }

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
          {availableSubjects.map((filterSubjectKey, index) => (
            <SubjectFilters
              key={filterSubjectKey}
              isFirstSubject={index === 0}
              filterSubjectKey={filterSubjectKey}
              pathObject={pathObjects && pathObjects[index]}
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

FilterConnections.propTypes = {
  availableFilters: AvailableFiltersShape,
  activeFilters: PropTypes.arrayOf(FilterShape),
  topics: PropTypes.arrayOf(TopicShape),
  resourceSubjects: PropTypes.arrayOf(PropTypes.string),
  structure: PropTypes.arrayOf(StructureShape),
  updateFilter: PropTypes.func,
  resourceId: PropTypes.string,
  pathObjects: PropTypes.arrayOf(
    PropTypes.shape({
      subject: SubjectShape,
      topic: TopicShape,
    }),
  ),
};

export default injectT(FilterConnections);
