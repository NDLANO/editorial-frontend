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
import Button from '@ndla/button';
import { Field } from '../../../components/Fields';
import { formClasses } from '../../Form';
import {
  fetchResourceTypes,
  fetchFilters,
  fetchTopics,
  fetchSubjects,
  fetchSubjectTopics,
  updateTaxonomy,
  queryResources,
  fetchTopicArticle,
  fetchFullResource,
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
import SaveButton from '../../../components/SaveButton';

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
      resourceTaxonomy: {
        resourceTypes: [],
        filter: [],
        topics: [],
        isLoadingResource: true,
      },
      taxonomy: {
        allFilters: [],
        allTopics: [],
        availableFilters: {},
        availableResourceTypes: [],
        isLoadingTaxonomy: false,
      },
      isSaving: false,
      saveSuccess: false,
      taxonomyChanges: {
        resourceTypes: [],
        filter: [],
        topics: [],
      },
    };
    this.retriveBreadCrumbs = this.retriveBreadCrumbs.bind(this);
    this.stageTaxonomyChanges = this.stageTaxonomyChanges.bind(this);
    this.removeConnection = this.removeConnection.bind(this);
    this.setPrimaryConnection = this.setPrimaryConnection.bind(this);
    this.getSubjectTopics = this.getSubjectTopics.bind(this);
    this.onChangeSelectedResource = this.onChangeSelectedResource.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.updateSubject = this.updateSubject.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchTaxonomy = this.fetchTaxonomy.bind(this);
  }

  async componentDidMount() {
    const { language } = this.props;
    this.fetchTaxonomy();
    try {
      const [
        allResourceTypes,
        allFilters,
        allTopics,
        subjects,
      ] = await Promise.all([
        fetchResourceTypes(language),
        fetchFilters(language),
        fetchTopics(language),
        fetchSubjects(language),
      ]);
      // Fetch all relevant subjects topics for resource
      const sortedSubjects = subjects
        .filter(subject => subject.name)
        .sort(sortByName);

      // Filter out items with no name (is required)
      this.setState({
        taxonomy: {
          availableResourceTypes: allResourceTypes.filter(
            resourceType => resourceType.name,
          ),
          availableFilters: filterToSubjects(
            allFilters.filter(filt => filt.name),
          ),
          allFilters: allFilters.filter(filt => filt.name),
          allTopics: allTopics.filter(topic => topic.name),
          isLoadingTaxonomy: false,
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

    this.stageTaxonomyChanges({
      resourceTypes: val,
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
      this.updateSubject(subjectid, { loading: true });
      const allTopics = await fetchSubjectTopics(subjectid);
      const groupedTopics = groupTopics(allTopics);
      this.updateSubject(subjectid, { loading: false, topics: groupedTopics });
    } catch (e) {
      handleError(e);
    }
  }

  setPrimaryConnection(id) {
    const { topics } = this.state.taxonomyChanges;

    this.stageTaxonomyChanges({
      topics: topics.map(topic => ({
        ...topic,
        primary: topic.id === id,
      })),
    });
  }

  async fetchTaxonomy() {
    const { articleId, language } = this.props;
    try {
      const resource = await queryResources(articleId, language);
      if (resource.length > 0) {
        const {
          resourceTypes,
          filters,
          parentTopics,
        } = await fetchFullResource(resource[0].id, language);

        const topics = await Promise.all(
          // Need to fetch each topic seperate because path is not returned in parentTopics
          parentTopics.map(async item => {
            const topicArticle = await fetchTopicArticle(item.id, language);
            return {
              ...topicArticle,
              primary: item.isPrimary,
              connectionId: item.connectionId,
            };
          }),
        );

        this.setState({
          resourceTaxonomy: {
            resourceTypes,
            filter: filters,
            topics,
            isLoadingResource: false,
          },
          taxonomyChanges: {
            topics,
            resourceTypes,
            filter: filters,
          },
        });
      }
    } catch (e) {
      handleError(e);
    }
  }

  stageTaxonomyChanges(properties) {
    this.setState(prevState => ({
      taxonomyChanges: {
        ...prevState.taxonomyChanges,
        ...properties,
      },
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { resourceTaxonomy, taxonomyChanges } = this.state;
    const { language, articleId } = this.props;
    this.setState({ isSaving: true });
    const didUpdate = await updateTaxonomy(
      articleId,
      resourceTaxonomy,
      taxonomyChanges,
      language,
    );
    if (didUpdate) this.fetchTaxonomy();
    this.setState({ saveSuccess: true, isSaving: false }, () =>
      setTimeout(() => this.setState({ saveSuccess: false }), 5000),
    );
  }

  updateSubject(subjectid, newSubject) {
    this.setState(prevState => ({
      structure: prevState.structure.map(subject => {
        if (subject.id === subjectid) {
          const updatedSubject = { ...subject, ...newSubject };
          return updatedSubject;
        }
        return subject;
      }),
    }));
  }

  retriveBreadCrumbs(topic) {
    const {
      structure,
      taxonomy: { allTopics },
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
        const topicPath = allTopics.find(subtopic => subtopic.id === pathId);
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
    const { topics, filter } = this.state.taxonomyChanges;
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
        this.stageTaxonomyChanges({
          filter: updatedFilters,
        });
      }
    }

    // Auto set primary of only one connection.
    if (updatedTopics.length === 1) {
      updatedTopics[0].primary = true;
    }
    this.stageTaxonomyChanges({
      topics: updatedTopics,
    });
  }

  updateFilter(filter, relevanceId, remove) {
    const updatedFilters = this.state.taxonomyChanges.filter.filter(
      modelFilter => modelFilter.id !== filter.id,
    );
    if (!remove) {
      updatedFilters.push({ ...filter, relevanceId });
    }

    this.stageTaxonomyChanges({
      filter: updatedFilters,
    });
  }

  render() {
    const {
      taxonomy: {
        isLoadingTaxonomy,
        availableResourceTypes,
        availableFilters,
        allTopics,
      },
      resourceTaxonomy: { isLoadingResource },
      taxonomyChanges: { resourceTypes, topics, filter },
      structure,
      isSaving,
      saveSuccess,
    } = this.state;
    const { t, closePanel } = this.props;

    if (isLoadingTaxonomy || isLoadingResource) {
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
          taxonomyTopics={allTopics}
          activeTopics={topics}
          retriveBreadCrumbs={this.retriveBreadCrumbs}
          removeConnection={this.removeConnection}
          setPrimaryConnection={this.setPrimaryConnection}
          stageTaxonomyChanges={this.stageTaxonomyChanges}
          getSubjectTopics={this.getSubjectTopics}
        />

        {topics.length > 0 && (
          <FilterConnections
            topics={topics}
            filter={filter}
            structure={structure}
            availableFilters={availableFilters}
            updateFilter={this.updateFilter}
          />
        )}
        <Field right {...formClasses('form-actions')}>
          <Button outline onClick={closePanel} disabled={isSaving}>
            {t('form.abort')}
          </Button>
          <SaveButton
            isSaving={isSaving}
            showSaved={saveSuccess}
            onClick={this.handleSubmit}
            defaultText="saveTax"
          />
        </Field>
      </Fragment>
    );
  }
}

LearningResourceTaxonomy.propTypes = {
  language: PropTypes.string,
  articleId: PropTypes.string,
  closePanel: PropTypes.func,
};

export default injectT(LearningResourceTaxonomy);
