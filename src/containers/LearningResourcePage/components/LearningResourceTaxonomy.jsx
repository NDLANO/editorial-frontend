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
import { FieldHeader, Dropdown } from '@ndla/forms';
import { Spinner } from '@ndla/editor';
import { ErrorMessage } from '@ndla/ui';
import { Field } from '../../../components/Fields';
import {
  fetchResourceTypes,
  fetchFilters,
  fetchTopics,
  fetchSubjects,
  fetchSubjectTopics,
  fetchTopicConnections,
  updateTaxonomy,
  getFullResource,
  createResource,
  getResourceId,
} from '../../../modules/taxonomy';
import {
  filterToSubjects,
  sortByName,
  groupTopics,
  selectedResourceTypeValue,
} from '../../../util/taxonomyHelpers';
import handleError from '../../../util/handleError';
import TopicConnections from './taxonomy/TopicConnections';
import FilterConnections from '../../../components/Taxonomy/filter/FilterConnections';
import SaveButton from '../../../components/SaveButton';
import { FormActionButton } from '../../Form';
import HowToHelper from '../../../components/HowTo/HowToHelper';

const resourceTypesToOptionList = availableResourceTypes =>
  availableResourceTypes.map(resourceType =>
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
  constructor() {
    super();
    this.state = {
      resourceId: '',
      structure: [],
      status: 'initial',
      saveStatus: 'initial',
      resourceTaxonomy: {
        resourceTypes: [],
        filter: [],
        topics: [],
      },
      taxonomyChoices: {
        allFilters: [],
        allTopics: [],
        availableFilters: {},
        availableResourceTypes: [],
      },
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
    this.fetchTaxonomyChoices = this.fetchTaxonomyChoices.bind(this);
  }

  componentDidMount() {
    this.fetchTaxonomy();
    this.fetchTaxonomyChoices();
  }

  onChangeSelectedResource(e) {
    const {
      taxonomyChoices: { availableResourceTypes },
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
    const { language, articleId } = this.props;
    try {
      let { resourceId } = this.state;
      this.setState({ status: 'loading' });
      if (!resourceId) {
        resourceId = await getResourceId({ articleId, language });
      }
      if (resourceId) {
        const { resourceTypes, filters, topics } = await getFullResource(
          resourceId,
          language,
        );

        const topicConnections = await Promise.all(
          topics.map(topic => fetchTopicConnections(topic.id)),
        );
        const topicsWithConnections = topics.map((topic, index) => ({
          topicConnections: topicConnections[index],
          ...topic,
        }));

        this.setState({
          resourceId,
          status: 'success',
          resourceTaxonomy: {
            resourceTypes,
            filter: filters,
            topics: topicsWithConnections,
          },
          taxonomyChanges: {
            topics: topicsWithConnections,
            resourceTypes,
            filter: filters,
          },
        });
      } else {
        this.setState(prevState => ({
          resourceTaxonomy: {
            ...prevState.resourceTaxonomy,
          },
          status: 'success',
        }));
      }
    } catch (e) {
      handleError(e);
      this.setState({ status: 'error' });
    }
  }

  async fetchTaxonomyChoices() {
    const { language } = this.props;
    try {
      this.setState({ status: 'loading' });
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

      const sortedSubjects = subjects
        .filter(subject => subject.name)
        .sort(sortByName);

      if (this.state.status !== 'error')
        this.setState({
          taxonomyChoices: {
            availableResourceTypes: allResourceTypes.filter(
              resourceType => resourceType.name,
            ),
            availableFilters: filterToSubjects(
              allFilters.filter(filt => filt.name),
            ),
            allFilters: allFilters.filter(filt => filt.name),
            allTopics: allTopics.filter(topic => topic.name),
          },
          status: 'success',
          structure: sortedSubjects,
        });
    } catch (e) {
      handleError(e);
      this.setState({ status: 'error' });
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
    let { resourceId } = this.state;
    const { language, articleId, title } = this.props;
    this.setState({ saveStatus: 'loading' });
    try {
      if (!resourceId) {
        await createResource({
          contentUri: `urn:article:${articleId}`,
          name: title,
        });
        resourceId = await getResourceId({ articleId, language });
        this.setState({
          resourceId,
        });
      }
      if (resourceId) {
        const didUpdate = await updateTaxonomy(
          resourceId,
          resourceTaxonomy,
          taxonomyChanges,
          language,
        );
        if (didUpdate) this.fetchTaxonomy();
        this.setState({ saveStatus: 'success' }, () =>
          setTimeout(() => this.setState({ saveStatus: 'initial' }), 5000),
        );
      }
    } catch (err) {
      handleError(err);
      this.setState({ saveStatus: 'error' });
    }
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

  retriveBreadCrumbs(topicPath) {
    const {
      structure,
      taxonomyChoices: { allTopics },
    } = this.state;
    try {
      let topicPaths = topicPath
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
      const { availableFilters } = this.state.taxonomyChoices;
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

  updateFilter(resourceId, filter, relevanceId, remove) {
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
      taxonomyChoices: { availableResourceTypes, availableFilters, allTopics },
      taxonomyChanges: { resourceTypes, topics, filter },
      structure,
      status,
      saveStatus,
    } = this.state;

    const { t, closePanel } = this.props;

    if (status === 'loading') {
      return <Spinner />;
    }
    if (status === 'error' || saveStatus === 'error') {
      return (
        <ErrorMessage
          illustration={{
            url: '/Oops.gif',
            altText: t('errorMessage.title'),
          }}
          messages={{
            title: t('errorMessage.title'),
            description: t('errorMessage.taxonomy'),
          }}
        />
      );
    }

    return (
      <Fragment>
        <FieldHeader
          title={t('taxonomy.resourceTypes.title')}
          subTitle={t('taxonomy.resourceTypes.subTitle')}>
          <HowToHelper
            pageId="TaxonomyContentTypes"
            tooltip={t('taxonomy.resourceTypes.helpLabel')}
          />
        </FieldHeader>
        <Dropdown
          value={selectedResourceTypeValue(resourceTypes)}
          onChange={this.onChangeSelectedResource}>
          <option value="">{t('taxonomy.resourceTypes.placeholder')}</option>
          {resourceTypesToOptionList(availableResourceTypes)}
        </Dropdown>
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
        <Field right>
          <FormActionButton
            outline
            onClick={closePanel}
            disabled={saveStatus === 'loading'}>
            {t('form.abort')}
          </FormActionButton>
          <SaveButton
            isSaving={saveStatus === 'loading'}
            showSaved={saveStatus === 'success'}
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
