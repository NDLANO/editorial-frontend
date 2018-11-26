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
  groupTopics,
  selectedResourceTypeValue,
} from '../../../util/taxonomyHelpers';
import handleError from '../../../util/handleError';
import TopicConnections from './TopicConnections';
import FilterConnections from './FilterConnections';

const resourceTypesToOptionList = availableResourceTypes =>
  availableResourceTypes.map(
    resourceType =>
      resourceType.subtypes ? (
        resourceType.subtypes.map(subtype => (
          <option value={`${resourceType.id},${subtype.id}`} key={subtype.id}>
            {resourceType.name} - {subtype.name}
          </option>
        ))
      ) : (
        <option key={resourceType.id} value={resourceType.id}>
          {resourceType.name}
        </option>
      ),
  );

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
    this.getSubjectTopics = this.getSubjectTopics.bind(this);
    this.onChangeSelectedResource = this.onChangeSelectedResource.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
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
        structure: sortedSubjects,
      });
    } catch (e) {
      handleError(e);
    }
  }

  onChangeSelectedResource(e) {
    const {
      taxonomy: { availableResourceTypes },
    } = this.state;
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
  }

  async getSubjectTopics(subjectid) {
    if (
      this.state.structure.some(
        subject => subject.id === subjectid && subject.topics,
      )
    ) {
      return;
    }
    try {
      const allTopics = await fetchSubjectTopics(subjectid);
      const groupedTopics = groupTopics(allTopics);
      this.setState(prevState => ({
        structure: prevState.structure.map(subject => {
          if (subject.id === subjectid) {
            const updatedSubject = { ...subject, topics: groupedTopics };
            return updatedSubject;
          }
          return subject;
        }),
      }));
    } catch (e) {
      handleError(e);
    }
  }

  getOnChangeFunction() {
    return this.props.commonFieldProps.bindInput().onChange;
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
    const {
      structure,
      taxonomy: { topics },
    } = this.state;
    try {
      let topicPaths = topic.path
        .split('/')
        .splice(1)
        .map(url => `urn:${url}`);

      const subject = structure.find(
        structureSubject => structureSubject.id === topicPaths[0],
      );
      topicPaths = topicPaths.splice(1);
      const returnPaths = [];

      returnPaths.push({
        name: subject.name,
        id: subject.id,
      });
      topicPaths.forEach(pathId => {
        const topicPath = topics.find(subtopic => subtopic.id === pathId);
        returnPaths.push({
          name: topicPath.name,
          id: topicPath.id,
        });
      });

      return returnPaths;
    } catch (err) {
      handleError(err);
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
    const { resourceTypes } = model;

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
          value={selectedResourceTypeValue(resourceTypes)}
          onChange={this.onChangeSelectedResource}>
          <option value="">{t('taxonomy.resourceTypes.placeholder')}</option>
          {resourceTypesToOptionList(availableResourceTypes)}
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
          getSubjectTopics={this.getSubjectTopics}
        />

        {model.topics.length > 0 && (
          <FilterConnections
            model={model}
            structure={structure}
            taxonomy={this.state.taxonomy}
            updateFilter={this.updateFilter}
          />
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
