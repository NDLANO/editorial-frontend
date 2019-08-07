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
  addTopic,
  addTopicToTopic,
  addSubjectTopic,
  addFilterToTopic,
} from '../../../modules/taxonomy';
import {
  filterToSubjects,
  sortByName,
  groupTopics,
  pathToUrnArray,
} from '../../../util/taxonomyHelpers';
import handleError from '../../../util/handleError';
import SaveButton from '../../../components/SaveButton';
import { FormikActionButton } from '../../FormikForm';
import TopicArticleConnections from './TopicArticleConnections';

class TopicArticleTaxonomy extends Component {
  constructor() {
    super();
    this.state = {
      structure: [],
      status: 'initial',
      saveStatus: 'initial',
      isDirty: false,
      topics: [],
      stagedTopicChanges: [],
      taxonomyChoices: {
        availableFilters: {},
        allFilters: [],
        allTopics: [],
      },
    };
    this.retriveBreadCrumbs = this.retriveBreadCrumbs.bind(this);
    this.stageTaxonomyChanges = this.stageTaxonomyChanges.bind(this);
    this.removeConnection = this.removeConnection.bind(this);
    this.getSubjectTopics = this.getSubjectTopics.bind(this);
    this.updateSubject = this.updateSubject.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchTaxonomy = this.fetchTaxonomy.bind(this);
    this.createAndPlaceTopic = this.createAndPlaceTopic.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentDidMount() {
    this.fetchTaxonomy();
  }

  async getSubjectTopics(subjectId) {
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
  }

  async fetchTaxonomy() {
    const {
      article: { language, id },
    } = this.props;
    try {
      this.setState({ status: 'loading' });
      const [topics, allTopics, allFilters, subjects] = await Promise.all([
        queryTopics(id, language),
        fetchTopics(language),
        fetchFilters(language),
        fetchSubjects(language),
      ]);

      const sortedSubjects = subjects
        .filter(subject => subject.name)
        .sort(sortByName);

      this.setState({
        status: 'success',
        topics,
        stagedTopicChanges: topics,
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
  }

  stageTaxonomyChanges({ addTopicId, removeTopicId, path }) {
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
        stagedTopicChanges: [...prevState.stagedTopicChanges, newTopic],
      }));
    } else if (addTopicId) {
      let newTopic = this.state.taxonomyChoices.allTopics.find(
        topic => topic.id === addTopicId,
      );
      if (!newTopic) {
        // TODO refresh topics?
      }
      this.setState(prevState => ({
        isDirty: true,
        stagedTopicChanges: [...prevState.stagedTopicChanges, newTopic],
      }));
    } else {
      this.setState(prevState => ({
        isDirty: true,
        stagedTopicChanges: [
          ...prevState.stagedTopicChanges.filter(
            topic => topic.id !== removeTopicId,
          ),
        ],
      }));
    }
  }

  async createAndPlaceTopic(topic, articleId) {
    const newTopicPath = await addTopic({
      name: topic.name,
      contentUri: `urn:article:${articleId}`,
    });
    const paths = pathToUrnArray(topic.path);
    const newTopicId = newTopicPath.split('/').pop();
    if (paths.length > 2) {
      // we are placing it under a topic
      const parentTopicId = paths.slice(-2)[0];
      await addTopicToTopic({
        subtopicid: newTopicId,
        topicid: parentTopicId,
      });
      const { structure } = this.state;
      const topicFilters = structure
        .find(subject => subject.id === paths[0])
        .topics.find(topic => topic.id === parentTopicId).filters;
      await Promise.all(
        topicFilters.map(({ id, relevanceId }) =>
          addFilterToTopic({ filterId: id, relevanceId, topicId: newTopicId }),
        ),
      );
    } else {
      // we are placing it under a subject
      await addSubjectTopic({
        topicid: newTopicId,
        subjectid: paths[0],
      });
    }
    return {
      name: topic.name,
      id: newTopicId,
      path: topic.path.replace('staged', newTopicId.replace('urn:', '')),
    };
  }

  async handleSubmit(evt) {
    evt.preventDefault();
    const { stagedTopicChanges, topics } = this.state;
    const {
      updateNotes,
      article: { id: articleId, language, revision },
    } = this.props;
    this.setState({ saveStatus: 'loading', status: 'loading' });

    const stagedNewTopics = stagedTopicChanges.filter(
      topic => topic.id === 'staged',
    );
    const changedTopics = stagedTopicChanges.filter(
      topic => topic.id !== 'staged',
    );
    const newTopics = await Promise.all(
      stagedNewTopics.map(topic => this.createAndPlaceTopic(topic, articleId)),
    );

    const deletedTopics = topics.filter(
      topic => !changedTopics.some(stagedTopic => stagedTopic.id === topic.id),
    );
    const addedTopics = changedTopics.filter(
      stagedTopic => !topics.some(topic => topic.id === stagedTopic.id),
    );

    try {
      await Promise.all([
        ...addedTopics.map(addedTopic =>
          updateTopic({
            id: addedTopic.id,
            name: addedTopic.name,
            contentUri: `urn:article:${articleId}`,
          }),
        ),
        ...deletedTopics.map(deletedTopic =>
          updateTopic({
            id: deletedTopic.id,
            name: deletedTopic.name,
            contentUri: undefined,
          }),
        ),
      ]);
      updateNotes({
        id: articleId,
        revision,
        language,
        notes: ['Oppdatert taksonomi.'],
      });

      const updatedTopics = [...changedTopics, ...newTopics];

      this.setState({
        isDirty: false,
        topics: updatedTopics,
        stagedTopicChanges: updatedTopics,
        saveStatus: 'success',
        status: 'success',
      });
    } catch (err) {
      handleError(err);
      this.setState({ saveStatus: 'error' });
    }
  }

  updateSubject(subjectid, newSubject) {
    this.setState(prevState => ({
      structure: prevState.structure.map(subject => {
        if (subject.id === subjectid) {
          return { ...subject, ...newSubject };
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
    const {
      article: { title },
    } = this.props;
    try {
      const [subjectPath, ...topicPaths] = pathToUrnArray(topicPath);

      const subject = structure.find(
        structureSubject => structureSubject.id === subjectPath,
      );
      const returnPaths = [];
      returnPaths.push({
        name: subject.name,
        id: subject.id,
      });
      topicPaths.forEach(pathId => {
        const topicPath = allTopics.find(subtopic => subtopic.id === pathId);
        if (topicPath) {
          returnPaths.push({
            name: topicPath.name,
            id: topicPath.id,
          });
        } else {
          returnPaths.push({ name: title, id: pathId });
        }
      });
      return returnPaths;
    } catch (err) {
      handleError(err);
      return false;
    }
  }

  removeConnection(id) {
    this.stageTaxonomyChanges({ removeTopicId: id });
  }

  onCancel() {
    const { isDirty } = this.state;
    const { closePanel } = this.props;
    if (!isDirty) {
      closePanel();
    } else {
      // TODO open warning
      closePanel();
    }
  }

  render() {
    const {
      taxonomyChoices: { availableFilters, allTopics },
      stagedTopicChanges,
      structure,
      status,
      saveStatus,
      isDirty,
    } = this.state;
    const { t } = this.props;

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
        <TopicArticleConnections
          availableFilters={availableFilters}
          structure={structure}
          taxonomyTopics={allTopics}
          activeTopics={stagedTopicChanges}
          retriveBreadCrumbs={this.retriveBreadCrumbs}
          removeConnection={this.removeConnection}
          getSubjectTopics={this.getSubjectTopics}
          stageTaxonomyChanges={this.stageTaxonomyChanges}
        />
        <Field right>
          <FormikActionButton
            outline
            onClick={this.onCancel}
            disabled={saveStatus === 'loading'}>
            {t('form.abort')}
          </FormikActionButton>
          <SaveButton
            isSaving={saveStatus === 'loading'}
            showSaved={saveStatus === 'success' && !isDirty}
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
