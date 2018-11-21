/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { FormHeader, FormDropdown } from '@ndla/forms';
import { Spinner } from '@ndla/editor';
import { Additional, Core } from '@ndla/icons/common';
import {
  filterbuttonwrapper,
  FilterButton,
  FilterCheckBox,
  FilterListTR,
  FilterTable,
  SubjectName,
} from './LearningResourceTaxonomyStyles';
import { CommonFieldPropsShape, TaxonomyShape } from '../../../shapes';
import {
  fetchResourceTypes,
  fetchFilters,
  fetchTopics,
  fetchSubjects,
  fetchSubjectTopics,
} from '../../../modules/taxonomy';
import {
  filterToSubjects,
  sortByName,
  connectionTopicsToParent,
} from '../../../util/taxonomyHelpers';
import handleError from '../../../util/handleError';
import TopicConnections from './TopicConnections';

const FILTER_SUPPLEMENTARY_ID = 'urn:relevance:supplementary';
const FILTER_CORE_ID = 'urn:relevance:core';

class LearningResourceTaxonomy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      structure: [],
      taxonomy: {
        resourceTypes: [],
        filters: [],
        topics: [],
        relevances: [],
        availableFilters: {},
        availableResourceTypes: [],
      },
    };
    this.retriveBreadCrumbs = this.retriveBreadCrumbs.bind(this);
    this.getOnChangeFunction = this.getOnChangeFunction.bind(this);
    this.removeConnection = this.removeConnection.bind(this);
    this.setPrimaryConnection = this.setPrimaryConnection.bind(this);
  }

  async componentDidMount() {
    const { model } = this.props;
    try {
      const [resourceTypes, filters, topics, subjects] = await Promise.all([
        fetchResourceTypes(model.language),
        fetchFilters(model.language),
        fetchTopics(model.language),
        fetchSubjects(model.language),
      ]);
      // Fetch all relevant subjects topics for resource
      const sortedSubjects = subjects
        .filter(subject => subject.name)
        .sort(sortByName);

      const subjectIds = sortedSubjects.map(subject => subject.id);
      const subjectsTopics = await Promise.all(
        subjectIds.map(subjectId => fetchSubjectTopics(subjectId)),
      );

      // Filter out items with no name (is required)
      this.setState({
        taxonomy: {
          availableResourceTypes: resourceTypes.filter(
            resourceType => resourceType.name,
          ),
          availableFilters: filterToSubjects(
            filters.filter(filter => filter.name),
          ),
          filters: filters.filter(filter => filter.name),
          topics: topics.filter(topic => topic.name),
          hasLoadedData: true,
        },
        structure: sortedSubjects.map((subject, index) => {
          const updateSubject = subject;
          updateSubject.subtopics = subjectsTopics[index].length
            ? connectionTopicsToParent(subjectsTopics[index], subject.id)
            : [];
          return updateSubject;
        }),
      });
    } catch (e) {
      handleError(e);
    }
  }

  getOnChangeFunction() {
    const { commonFieldProps } = this.props;
    const defaultDropdownProps = {
      obligatory: true,
      textField: 'name',
      valueField: 'id',
      ...commonFieldProps,
    };

    const { onChange } = defaultDropdownProps.bindInput(
      defaultDropdownProps.name,
    );

    return onChange;
  }

  setPrimaryConnection(id) {
    const { topics } = this.props.model;
    const onChange = this.getOnChangeFunction();

    onChange({
      target: {
        name: 'topics',
        value: topics.map(topic => {
          const returnTopic = topic;
          returnTopic.primary = returnTopic.id === id;
          return returnTopic;
        }),
      },
    });
  }

  retriveBreadCrumbs(topic) {
    try {
      let topicPaths = topic.path
        .split('/')
        .splice(1)
        .map(url => `urn:${url}`);

      const subject = this.state.structure.find(
        structureSubject => structureSubject.id === topicPaths[0],
      );
      topicPaths = topicPaths.splice(1);
      const returnPaths = [];

      returnPaths.push({
        name: subject.name,
        id: subject.id,
      });
      let { subtopics } = subject;
      topicPaths.forEach(pathId => {
        subtopics = subtopics.find(subtopic => subtopic.id === pathId);
        returnPaths.push({
          name: subtopics.name,
          id: subtopics.id,
        });
        ({ subtopics } = subtopics);
      });

      return returnPaths;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  removeConnection(id) {
    const { topics, filter } = this.props.model;
    const onChange = this.getOnChangeFunction();
    const currentConnection = topics.find(topic => topic.id === id);
    const updatedTopics = topics.filter(topic => topic.id !== id);
    const currentConnectionSubjectId = currentConnection.path.split('/')[1];
    // 1. Check if last of connection within this subject
    // 2. If so, remove filters that subject
    if (
      !updatedTopics.some(
        topic => topic.path.indexOf(currentConnectionSubjectId) !== -1,
      )
    ) {
      const { availableFilters } = this.state.taxonomy;
      const removeFiltersFrom =
        availableFilters[`urn:${currentConnectionSubjectId}`];
      const updatedFilters = filter.filter(
        checkFilter =>
          !removeFiltersFrom.some(
            removeFilter => removeFilter.id === checkFilter.id,
          ),
      );
      if (updatedFilters.length !== filter.length) {
        // Need to update filters
        onChange({
          target: { name: 'filter', value: updatedTopics },
        });
      }
    }

    // Auto set primary of only one connection.
    if (updatedTopics.length === 1) {
      updatedTopics[0].primary = true;
    }
    onChange({
      target: { name: 'topics', value: updatedTopics },
    });
  }

  selectedResourceTypeValue() {
    const { resourceTypes } = this.props.model;
    if (!resourceTypes.length) {
      return '';
    }
    const withParentId = resourceTypes.find(
      resourceType => resourceType.parentId,
    );
    if (withParentId) {
      return `${withParentId.parentId},${withParentId.id}`;
    }
    // return first match (multiple selections not possible..)
    return resourceTypes[0].id;
  }

  updateFilter(filter, relevanceId, remove) {
    const updatedFilters = this.props.model.filter.filter(
      modelFilter => modelFilter.id !== filter.id,
    );
    if (!remove) {
      updatedFilters.push({ ...filter, relevanceId });
    }

    const onChange = this.getOnChangeFunction();

    onChange({
      target: { name: 'filter', value: updatedFilters },
    });
  }

  renderSubjectFilters() {
    const {
      t,
      model: { filter, topics },
    } = this.props;
    const { taxonomy, structure } = this.state;
    const availableSubjects = {};
    topics.forEach(topic => {
      availableSubjects[`urn:${topic.path.split('/')[1]}`] = true;
    });
    return (
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
                              this.updateFilter(
                                currentFilter,
                                FILTER_CORE_ID,
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
                                  FILTER_SUPPLEMENTARY_ID
                              }
                              onClick={() =>
                                this.updateFilter(
                                  currentFilter,
                                  FILTER_SUPPLEMENTARY_ID,
                                )
                              }>
                              <Additional className="c-icon--22" />{' '}
                              {t('taxonomy.filters.additional')}
                            </FilterButton>
                            <FilterButton
                              type="button"
                              selected={
                                useFilter &&
                                useFilter.relevanceId === FILTER_CORE_ID
                              }
                              onClick={() =>
                                this.updateFilter(currentFilter, FILTER_CORE_ID)
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
    );
  }

  render() {
    const {
      taxonomy: {
        availableResourceTypes,
        availableFilters,
        hasLoadedData,
        topics,
      },
      structure,
    } = this.state;
    const { t, model, taxonomyIsLoading } = this.props;

    if (taxonomyIsLoading || !hasLoadedData) {
      return <Spinner />;
    }

    return (
      <Fragment>
        <FormHeader
          title={t('taxonomy.resourceTypes.title')}
          subTitle={t('taxonomy.resourceTypes.subTitle')}
        />
        <FormDropdown
          value={this.selectedResourceTypeValue()}
          onChange={e => {
            const options = e.target.value.split(',');
            const selectedResource = availableResourceTypes.find(
              resourceType => resourceType.id === options[0],
            );
            const val = [
              {
                name: selectedResource.name,
                id: selectedResource.id,
              },
            ];
            if (options.length > 1) {
              const subType = selectedResource.subtypes.find(
                subtype => subtype.id === options[1],
              );
              val.push({
                id: subType.id,
                name: subType.name,
                parentId: selectedResource.id,
              });
            }
            const onChange = this.getOnChangeFunction();
            onChange({
              target: { name: 'resourceTypes', value: val },
            });
          }}>
          <option value="">{t('taxonomy.resourceTypes.placeholder')}</option>
          {availableResourceTypes.map(
            resourceType =>
              resourceType.subtypes ? (
                resourceType.subtypes.map(subtype => (
                  <option
                    value={`${resourceType.id},${subtype.id}`}
                    key={subtype.id}>
                    {resourceType.name} - {subtype.name}
                  </option>
                ))
              ) : (
                <option key={resourceType.id} value={resourceType.id}>
                  {resourceType.name}
                </option>
              ),
          )}
        </FormDropdown>
        <TopicConnections
          availableFilters={availableFilters}
          structure={structure}
          taxonomyTopics={topics}
          modelTopics={model.topics}
          retriveBreadCrumbs={this.retriveBreadCrumbs}
          removeConnection={this.removeConnection}
          setPrimaryConnection={this.setPrimaryConnection}
          getOnChangeFunction={this.getOnChangeFunction}
        />

        {model.topics.length > 0 && (
          <Fragment>
            <FormHeader
              title={t('taxonomy.filters.title')}
              subTitle={t('taxonomy.filters.subTitle')}
            />
            {this.renderSubjectFilters()}
          </Fragment>
        )}
      </Fragment>
    );
  }
}

LearningResourceTaxonomy.propTypes = {
  commonFieldProps: CommonFieldPropsShape.isRequired,
  taxonomy: TaxonomyShape,
  model: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    language: PropTypes.string,
    resourceTypes: PropTypes.arrayOf(PropTypes.shape({})),
    filter: PropTypes.arrayOf(PropTypes.shape({})),
    topics: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  taxonomyIsLoading: PropTypes.bool,
};

export default injectT(LearningResourceTaxonomy);
