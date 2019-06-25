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
      addTopicToTopic({
        subtopicid: newTopicId,
        topicid: paths.slice(-2)[0],
      });
    } else {
      // we are placing it under a subject
      addSubjectTopic({
        topicid: newTopicId,
        subjectid: paths[0],
      });
    }
  }

  async handleSubmit(evt) {
    evt.preventDefault();
    const { stagedTopicChanges, topics } = this.state;
    const {
      updateNotes,
      article: { id: articleId, language, revision },
    } = this.props;

    const changes = stagedTopicChanges.filter(topic => {
      if (topic.id === 'staged') {
        this.createAndPlaceTopic(topic, articleId);
        return false;
      }
      return true;
    });
    const deletedTopics = topics.filter(
      topic => !changes.some(stagedTopic => stagedTopic.id === topic.id),
    );
    const addedTopics = changes.filter(
      stagedTopic => !topics.some(topic => topic.id === stagedTopic.id),
    );

    this.setState({ saveStatus: 'loading', status: 'loading' });
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
      // Wait a sec before fetching taxonomy again
      await new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
        }, 2000);
      });
      this.fetchTaxonomy();

      this.setState({ isDirty: false, saveStatus: 'success' }, () =>
        setTimeout(() => this.setState({ saveStatus: 'initial' }), 5000),
      );
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
            showSaved={saveStatus === 'success'}
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
  }).isRequired,
  updateNotes: PropTypes.func.isRequired,
};

export default injectT(TopicArticleTaxonomy);
