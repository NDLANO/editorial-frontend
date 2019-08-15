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
import { Spinner } from '@ndla/editor';
import { ErrorMessage } from '@ndla/ui';
import Field from '../../../components/Field';
import {
  fetchFilters,
  fetchTopics,
  fetchSubjects,
  fetchSubjectTopics,
  queryTopics,
  updateTopic,
  fetchTopicConnections,
} from '../../../modules/taxonomy';
import {
  filterToSubjects,
  sortByName,
  groupTopics,
  sortIntoCreateDeleteUpdate,
  createAndPlaceTopic,
  createDeleteUpdateTopicFilters,
} from '../../../util/taxonomyHelpers';
import handleError from '../../../util/handleError';
import retriveBreadCrumbs from '../../../util/retriveBreadCrumbs';
import SaveButton from '../../../components/SaveButton';
import { FormikActionButton } from '../../FormikForm';
import TopicArticleConnections from './TopicArticleConnections';
import {
  deleteTopic,
  fetchTopicFilters,
  fetchTopicResources,
} from '../../../modules/taxonomy/topics';
import FilterConnections from '../../../components/Taxonomy/filter/FilterConnections';

class TopicArticleTaxonomy extends Component {
  constructor() {
    super();
    this.state = {
      structure: [],
      status: 'loading',
      isDirty: false,
      stagedTopicChanges: [],
      deletedTopics: [],
      stagedFilterChanges: [],
      taxonomyChoices: {
        availableFilters: {},
        allFilters: [],
        allTopics: [],
      },
    };
  }

  componentDidMount() {
    this.fetchTaxonomy();
  }

  getSubjectTopics = async subjectId => {
    if (
      this.state.structure.some(
        subject => subject.id === subjectId && subject.topics,
      )
    ) {
      return;
    }
    try {
      this.updateSubject(subjectId, { loading: true });
      const allTopics = await fetchSubjectTopics(subjectId);
      const groupedTopics = groupTopics(allTopics);
      this.updateSubject(subjectId, { loading: false, topics: groupedTopics });
    } catch (e) {
      handleError(e);
    }
  };

  fetchTaxonomy = async () => {
    const {
      article: { language, id },
    } = this.props;
    try {
      const [topics, allTopics, allFilters, subjects] = await Promise.all([
        queryTopics(id, language),
        fetchTopics(language),
        fetchFilters(language),
        fetchSubjects(language),
      ]);

      const sortedSubjects = subjects
        .filter(subject => subject.name)
        .sort(sortByName);

      const topicConnections = await Promise.all(
        topics.map(topic => fetchTopicConnections(topic.id)),
      );
      const topicFilters = await Promise.all(
        topics.map(topic => fetchTopicFilters(topic.id)),
      );
      const topicFiltersWithId = topicFilters.flatMap(curr => curr);

      const topicsWithConnections = topics.map((topic, index) => ({
        topicConnections: topicConnections[index],
        ...topic,
      }));

      this.setState({
        status: 'initial',
        stagedTopicChanges: topicsWithConnections,
        stagedFilterChanges: topicFiltersWithId,
        originalFilters: topicFiltersWithId,
        structure: sortedSubjects,
        taxonomyChoices: {
          allTopics: allTopics.filter(topic => topic.name),
          availableFilters: filterToSubjects(
            allFilters.filter(filt => filt.name),
          ),
          allFilters: allFilters.filter(filt => filt.name),
        },
      });
    } catch (e) {
      handleError(e);
      this.setState({ status: 'error' });
    }
  };

  stageTaxonomyChanges = ({ path, filter }) => {
    const {
      article: { title },
    } = this.props;
    if (path) {
      const newTopic = {
        id: 'staged',
        name: title,
        path: `${path}/staged`,
      };
      this.setState(prevState => ({
        isDirty: true,
        stagedTopicChanges: [newTopic],
        deletedTopics: prevState.stagedTopicChanges,
      }));
    }
    if (filter) {
      this.setState({ isDirty: true, stagedFilterChanges: filter });
    }
  };

  handleSubmit = async evt => {
    evt.preventDefault();
    const {
      stagedTopicChanges,
      deletedTopics,
      stagedFilterChanges,
      originalFilters,
      structure,
    } = this.state;
    const {
      updateNotes,
      article: { id: articleId, language, revision },
    } = this.props;
    this.setState({ status: 'loading' });

    const [
      createFilter,
      deleteFilter,
      updateFilter,
    ] = sortIntoCreateDeleteUpdate({
      changedItems: stagedFilterChanges,
      originalItems: originalFilters,
      updateProperty: 'relevanceId',
    });
    console.log(createFilter, deleteFilter, updateFilter);

    const stagedNewTopics = stagedTopicChanges.filter(
      topic => topic.id === 'staged',
    );
    try {
      const newTopics = await Promise.all(
        stagedNewTopics.map(topic =>
          createAndPlaceTopic(topic, articleId, structure),
        ),
      );
      const updatedFilters = await createDeleteUpdateTopicFilters(
        createFilter,
        deleteFilter,
        updateFilter,
        stagedFilterChanges,
      );
      const topicResources = await Promise.all(
        deletedTopics.map(topic => fetchTopicResources(topic.id)),
      );
      deletedTopics.forEach((deletedTopic, i) => {
        if (
          deletedTopic.topicConnections.length < 2 &&
          topicResources[i].length === 0
        ) {
          // topic has no subtopics or resources, we can safely delete topic
          deleteTopic(deletedTopic.id);
        }
        // If topic was not deleted, article will be in both topics, but will not be not a shared topic. Not really a valid state...
      });
      updateNotes({
        id: articleId,
        revision,
        language,
        notes: ['Oppdatert taksonomi.'],
      });

      this.setState({
        isDirty: false,
        stagedTopicChanges: newTopics.length ? newTopics : stagedTopicChanges,
        originalFilters: updatedFilters,
        stagedFilterChanges: updatedFilters,
        status: 'success',
      });
    } catch (err) {
      handleError(err);
      this.setState({ status: 'error' });
    }
  };

  updateSubject = (subjectid, newSubject) => {
    this.setState(prevState => ({
      structure: prevState.structure.map(subject => {
        if (subject.id === subjectid) {
          return { ...subject, ...newSubject };
        }
        return subject;
      }),
    }));
  };

  onCancel = () => {
    const { isDirty } = this.state;
    const { closePanel } = this.props;
    if (!isDirty) {
      closePanel();
    } else {
      // TODO open warning
      closePanel();
    }
  };

  updateFilter = (resourceId, filter, relevanceId, remove) => {
    const { stagedTopicChanges, stagedFilterChanges } = this.state;
    const topic = stagedTopicChanges.find(topic =>
      topic.paths.some(path =>
        path.includes(filter.subjectId.replace('urn:', '')),
      ),
    );
    let updatedFilter = { ...filter, topicId: topic && topic.id };
    const updatedFilters = stagedFilterChanges.filter(activeFilter => {
      const foundFilter = activeFilter.id === filter.id;
      if (foundFilter) {
        updatedFilter = {
          ...filter,
          ...activeFilter,
        };
      }
      return !foundFilter;
    });
    if (!remove) {
      updatedFilters.push({ ...updatedFilter, relevanceId });
    }
    this.stageTaxonomyChanges({
      filter: updatedFilters,
    });
  };

  render() {
    const {
      taxonomyChoices: { availableFilters, allTopics },
      stagedTopicChanges,
      stagedFilterChanges,
      structure,
      status,
      isDirty,
    } = this.state;
    const {
      t,
      article: { title },
    } = this.props;

    if (status === 'loading') {
      return <Spinner />;
    }
    if (status === 'error') {
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
        <TopicArticleConnections
          availableFilters={availableFilters}
          structure={structure}
          taxonomyTopics={allTopics}
          activeTopics={stagedTopicChanges}
          retriveBreadCrumbs={topicPath =>
            retriveBreadCrumbs({ topicPath, allTopics, structure, title })
          }
          getSubjectTopics={this.getSubjectTopics}
          stageTaxonomyChanges={this.stageTaxonomyChanges}
        />
        {stagedTopicChanges.length &&
          !stagedTopicChanges.find(topic => topic.id === 'staged') && (
            <FilterConnections
              topics={stagedTopicChanges}
              activeFilters={stagedFilterChanges}
              structure={structure}
              availableFilters={availableFilters}
              updateFilter={this.updateFilter}
            />
          )}
        <Field right>
          <FormikActionButton
            outline
            onClick={this.onCancel}
            disabled={status === 'loading'}>
            {t('form.abort')}
          </FormikActionButton>
          <SaveButton
            isSaving={status === 'loading'}
            showSaved={status === 'success' && !isDirty}
            disabled={!isDirty}
            onClick={this.handleSubmit}
            defaultText="saveTax"
          />
        </Field>
      </Fragment>
    );
  }
}

TopicArticleTaxonomy.propTypes = {
  language: PropTypes.string,
  closePanel: PropTypes.func.isRequired,
  article: PropTypes.shape({
    title: PropTypes.string,
    id: PropTypes.number,
    language: PropTypes.string,
    revision: PropTypes.number,
  }).isRequired,
  updateNotes: PropTypes.func.isRequired,
};

export default injectT(TopicArticleTaxonomy);
