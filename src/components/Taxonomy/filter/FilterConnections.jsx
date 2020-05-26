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
  TopicShape,
  FilterShape,
  AvailableFiltersShape,
  StructureShape,
} from '../../../shapes';
import HowToHelper from '../../HowTo/HowToHelper';

const FilterConnections = ({
  t,
  breadCrumbs,
  activeFilters,
  availableFilters,
  structure,
  updateFilter,
  resourceId,
}) => {
  const availableSubjects = breadCrumbs.map(path => path[0].id);

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
              breadCrumb={breadCrumbs && breadCrumbs[index]}
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
  resourceSubjects: PropTypes.arrayOf(PropTypes.string),
  structure: PropTypes.arrayOf(StructureShape),
  updateFilter: PropTypes.func,
  resourceId: PropTypes.string,
  breadCrumbs: PropTypes.arrayOf(TopicShape),
};

export default injectT(FilterConnections);
