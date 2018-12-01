import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Additional, Core } from '@ndla/icons/common';
import { FormHeader } from '@ndla/forms';
import { injectT } from '@ndla/i18n';
import {
  filterbuttonwrapper,
  FilterButton,
  FilterCheckBox,
  FilterListTR,
  FilterTable,
  SubjectName,
} from '../../../style/LearningResourceTaxonomyStyles';
import { TaxonomyShape } from '../../../shapes';
import {
  RESOURCE_FILTER_CORE,
  RESOURCE_FILTER_SUPPLEMENTARY,
} from '../../../constants';

const FilterConnections = ({
  t,
  model: { filter, topics },
  taxonomy,
  structure,
  updateFilter,
}) => {
  const availableSubjects = {};
  topics.forEach(topic => {
    availableSubjects[`urn:${topic.path.split('/')[1]}`] = true;
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
                {taxonomy.availableFilters[filterSubjectKey].map(
                  currentFilter => {
                    const useFilter = filter.find(
                      resourceFilter => resourceFilter.id === currentFilter.id,
                    );
                    const active = useFilter !== undefined;
                    return (
                      <FilterListTR key={currentFilter.id} active={active}>
                        <td>
                          <FilterCheckBox
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
                          </FilterCheckBox>
                        </td>
                        <td>
                          <div className={filterbuttonwrapper}>
                            <FilterButton
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
                            </FilterButton>
                            <FilterButton
                              type="button"
                              selected={
                                useFilter &&
                                useFilter.relevanceId === RESOURCE_FILTER_CORE
                              }
                              onClick={() =>
                                updateFilter(
                                  currentFilter,
                                  RESOURCE_FILTER_CORE,
                                )
                              }>
                              <Core className="c-icon--22" />{' '}
                              {t('taxonomy.filters.core')}
                            </FilterButton>
                          </div>
                        </td>
                      </FilterListTR>
                    );
                  },
                )}
              </Fragment>
            );
          })}
        </tbody>
      </FilterTable>
    </Fragment>
  );
};

FilterConnections.propTypes = {
  taxonomy: TaxonomyShape,
  model: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    language: PropTypes.string,
    resourceTypes: PropTypes.arrayOf(PropTypes.shape({})),
    filter: PropTypes.arrayOf(PropTypes.shape({})),
    topics: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  structure: PropTypes.arrayOf(PropTypes.object),
  updateFilter: PropTypes.func,
};

export default injectT(FilterConnections);
