/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Additional, Core } from '@ndla/icons/common';
import { FormHeader } from '@ndla/forms';
import { injectT } from '@ndla/i18n';
import {
  flexButtonCenterAlignStyle,
  StyledFilterButton,
  StyledFilterCheckBox,
  StyledFilterListTableRow,
  StyledFilterTable,
  StyledSubjectName,
} from '../../style/LearningResourceTaxonomyStyles';
import {
  RESOURCE_FILTER_CORE,
  RESOURCE_FILTER_SUPPLEMENTARY,
} from '../../constants';

const FilterItem = ({
  t,
  topics,
  filter,
  availableFilters,
  structure,
  updateFilter,
}) => {
  const availableSubjects = {};
  topics.forEach(topic => {
    topic.topicConnections.forEach(topicConnection => {
      availableSubjects[`urn:${topicConnection.paths[0].split('/')[1]}`] = true;
    });
  });
  return (
    <Fragment>
      <FormHeader
        title={t('taxonomy.filters.title')}
        subTitle={t('taxonomy.filters.subTitle')}
      />
      <StyledFilterTable>
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
                    <StyledSubjectName firstSubject={index === 0}>
                      {subject.name}:
                    </StyledSubjectName>
                  </td>
                </tr>
                {availableFilters[filterSubjectKey].map(currentFilter => {
                  const useFilter = filter.find(
                    resourceFilter => resourceFilter.id === currentFilter.id,
                  );
                  const active = useFilter !== undefined;
                  return (
                    <StyledFilterListTableRow
                      key={currentFilter.id}
                      active={active}>
                      <td>
                        <StyledFilterCheckBox
                          type="button"
                          onClick={() =>
                            updateFilter(
                              currentFilter,
                              RESOURCE_FILTER_CORE,
                              active,
                            )
                          }
                          className={active ? 'checkboxItem--checked' : ''}>
                          <span />
                          <span>{currentFilter.name}</span>
                        </StyledFilterCheckBox>
                      </td>
                      <td>
                        <div css={flexButtonCenterAlignStyle}>
                          <StyledFilterButton
                            type="button"
                            selected={
                              useFilter &&
                              useFilter.relevanceId ===
                                RESOURCE_FILTER_SUPPLEMENTARY
                            }
                            onClick={() =>
                              updateFilter(
                                currentFilter,
                                RESOURCE_FILTER_SUPPLEMENTARY,
                              )
                            }>
                            <Additional className="c-icon--22" />{' '}
                            {t('taxonomy.filters.additional')}
                          </StyledFilterButton>
                          <StyledFilterButton
                            type="button"
                            selected={
                              useFilter &&
                              useFilter.relevanceId === RESOURCE_FILTER_CORE
                            }
                            onClick={() =>
                              updateFilter(currentFilter, RESOURCE_FILTER_CORE)
                            }>
                            <Core className="c-icon--22" />{' '}
                            {t('taxonomy.filters.core')}
                          </StyledFilterButton>
                        </div>
                      </td>
                    </StyledFilterListTableRow>
                  );
                })}
              </Fragment>
            );
          })}
        </tbody>
      </StyledFilterTable>
    </Fragment>
  );
};

FilterItem.propTypes = {
  availableFilters: PropTypes.objectOf(PropTypes.array),
  filter: PropTypes.arrayOf(PropTypes.shape({})),
  topics: PropTypes.arrayOf(PropTypes.shape({})),
  structure: PropTypes.arrayOf(PropTypes.object),
  updateFilter: PropTypes.func,
};

export default injectT(FilterItem);
