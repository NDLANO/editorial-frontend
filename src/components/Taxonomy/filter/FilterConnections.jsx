/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormHeader } from '@ndla/forms';
import { injectT } from '@ndla/i18n';
import { StyledFilterTable } from '../../../style/LearningResourceTaxonomyStyles';
import SubjectFilters from './SubjectFilters';
import { TopicShape } from '../../../shapes'

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
    topic.topicConnections.forEach(topicConnection => {
      availableSubjects[`urn:${topicConnection.paths[0].split('/')[1]}`] = true;
    });
  });
  console.log("TOPICS, ", topics)
  return (
    <Fragment>
      <FormHeader
        title={t('taxonomy.filters.title')}
        subTitle={t('taxonomy.filters.subTitle')}
      />
      <StyledFilterTable>
        <tbody>
          {Object.keys(availableSubjects).map((filterSubjectKey, index) => (
            <SubjectFilters
              key={filterSubjectKey}
              isFirstSubject={index === 0}
              filterSubjectKey={filterSubjectKey}
              availableFilters={availableFilters}
              filter={filter}
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
  topics: []
}

FilterConnections.propTypes = {
  availableFilters: PropTypes.objectOf(PropTypes.array),
  filter: PropTypes.arrayOf(PropTypes.shape({})),
  topics: PropTypes.arrayOf(TopicShape),
  structure: PropTypes.arrayOf(PropTypes.object),
  updateFilter: PropTypes.func,
  resourceId: PropTypes.string,
};

export default injectT(FilterConnections);
