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
import Field from '../../../../components/Field';
import {
  fetchFilters,
  fetchTopics,
  fetchSubjects,
  fetchSubjectTopics,
  queryTopics,
  fetchTopicConnections,
  addTopicToTopic,
  addFilterToTopic,
  addSubjectTopic,
  deleteTopicFilter,
  updateTopicFilter,
  fetchTopicFilters,
  addTopic,
} from '../../../../modules/taxonomy';
import {
  filterToSubjects,
  sortByName,
  groupTopics,
  sortIntoCreateDeleteUpdate,
  pathToUrnArray,
} from '../../../../util/taxonomyHelpers';
import handleError from '../../../../util/handleError';
import retriveBreadCrumbs from '../../../../util/retriveBreadCrumbs';
import SaveButton from '../../../../components/SaveButton';
import { ActionButton } from '../../../FormikForm';
import TopicArticleConnections from './TopicArticleConnections';

import FilterConnections from '../../../../components/Taxonomy/filter/FilterConnections';
import { ArticleShape } from '../../../../shapes';
import { FormikFieldHelp } from '../../../../components/FormikField';

class TopicArticleTaxonomy extends Component {
  constructor() {
    super();
    this.state = {
      structure: [],
      status: 'loading',
      isDirty: false,
      stagedTopicChanges: [],
      stagedFilterChanges: [],
      taxonomyChoices: {
        availableFilters: {},
        allFilters: [],
        allTopics: [],
      },
      showWarning: false,
    };
  }

  componentDidMount() {
    this.fetchTaxonomy();
  }

  componentDidUpdate({ article: { id: prevId } }, prevState) {
    // We need to refresh taxonomy for when an article URL has been pasted and a new article is showing
    if (prevId !== this.props.article.id) {
      this.fetchTaxonomy();
    }
  }

  getSubjectTopics = async (subjectId, locale) => {
    if (this.state.structure.some(subject => subject.id === subjectId && subject.topics)) {
      return;
    }
    try {
      this.updateSubject(subjectId, { loading: true });
      const allTopics = await fetchSubjectTopics(subjectId, locale);
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

      const sortedSubjects = subjects.filter(subject => subject.name).sort(sortByName);

      const topicConnections = await Promise.all(
        topics.map(topic => fetchTopicConnections(topic.id)),
      );
      const topicFilters = await Promise.all(topics.map(topic => fetchTopicFilters(topic.id)));
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
          availableFilters: filterToSubjects(allFilters.filter(filt => filt.name)),
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
        stagedTopicChanges: [...prevState.stagedTopicChanges, newTopic],
      }));
    }
    if (filter) {
      this.setState({ isDirty: true, stagedFilterChanges: filter });
    }
  };

  addNewTopic = async stagedNewTopics => {
    const { stagedTopicChanges, originalFilters, structure } = this.state;
    const existingTopics = stagedTopicChanges.filter(t => !stagedNewTopics.includes(t));
    const {
      article: { id: articleId },
    } = this.props;
    const newTopics = await Promise.all(
      stagedNewTopics.map(topic => this.createAndPlaceTopic(topic, articleId, structure)),
    );
    const topicFilters = await Promise.all(newTopics.map(topic => fetchTopicFilters(topic.id)));
    const topicFiltersWithId = topicFilters.flatMap(curr => curr);
    this.setState({
      isDirty: false,
      stagedTopicChanges: [...existingTopics, ...newTopics],
      originalFilters: [...originalFilters, ...topicFiltersWithId],
      stagedFilterChanges: [...originalFilters, ...topicFiltersWithId],
      status: 'success',
    });
  };

  handleSubmit = async evt => {
    evt.preventDefault();
    const { stagedTopicChanges, stagedFilterChanges, originalFilters } = this.state;
    const {
      updateNotes,
      article: { id: articleId, language, revision },
    } = this.props;
    this.setState({ status: 'loading' });

    const stagedNewTopics = stagedTopicChanges.filter(topic => topic.id === 'staged');
    try {
      // we either update topic placement or update filters, never both
      if (stagedNewTopics.length > 0) {
        await this.addNewTopic(stagedNewTopics);
      } else {
        const [createFilter, deleteFilter, updateFilter] = sortIntoCreateDeleteUpdate({
          changedItems: stagedFilterChanges,
          originalItems: originalFilters,
          updateProperty: 'relevanceId',
        });
        const updatedFilters = await this.createDeleteUpdateTopicFilters(
          createFilter,
          deleteFilter,
          updateFilter,
          stagedFilterChanges,
        );

        this.setState({
          isDirty: false,
          originalFilters: updatedFilters,
          stagedFilterChanges: updatedFilters,
          status: 'success',
        });
      }
      updateNotes({
        id: articleId,
        revision,
        language,
        notes: ['Oppdatert taksonomi.'],
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
    const { setIsOpen } = this.props;
    if (!isDirty) {
      setIsOpen(false);
    } else {
      if (this.state.showWarning) {
        setIsOpen(false);
      } else {
        this.setState({ showWarning: true });
      }
    }
  };

  updateFilter = (resourceId, filter, relevanceId, remove) => {
    const { stagedTopicChanges, stagedFilterChanges } = this.state;
    let topic = stagedTopicChanges.find(topic =>
      topic.path.includes(filter.subjectId.replace('urn:', '')),
    );
    if (!topic) {
      topic = stagedTopicChanges[0];
    }
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

  createAndPlaceTopic = async (topic, articleId, structure) => {
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

      // add filters from parent
      const topicFilters =
        structure
          .find(subject => subject.id === paths[0])
          ?.topics.find(topic => topic.id === parentTopicId)?.filters || [];
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
  };

  createDeleteUpdateTopicFilters = async (
    createFilter,
    deleteFilter,
    updateFilter,
    stagedFilterChanges,
  ) => {
    const newFilters = await Promise.all(
      createFilter.map(filter =>
        addFilterToTopic({ filterId: filter.id, topicId: filter.topicId }),
      ),
    );
    await Promise.all([
      ...deleteFilter.map(({ connectionId }) => deleteTopicFilter({ connectionId })),
      ...updateFilter.map(({ connectionId, relevanceId }) =>
        updateTopicFilter({ connectionId, relevanceId }),
      ),
    ]);

    const newFiltersWithId = createFilter.map((f, i) => ({
      ...f,
      connectionId: newFilters[i].split('/').pop(),
    }));
    const updatedFilters = stagedFilterChanges.map(filter => {
      const newFilter = newFiltersWithId.find(f => f.id === filter.id);
      return newFilter || filter;
    });
    return updatedFilters;
  };

  render() {
    const {
      taxonomyChoices: { availableFilters, allTopics },
      stagedTopicChanges,
      stagedFilterChanges,
      structure,
      status,
      isDirty,
      showWarning,
    } = this.state;
    const {
      t,
      article: { title },
      locale,
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

    const breadCrumbs = [];
    stagedTopicChanges.forEach(topic => {
      if (topic.paths) {
        topic.paths.forEach(path =>
          breadCrumbs.push(retriveBreadCrumbs({ topicPath: path, allTopics, structure })),
        );
      } else {
        breadCrumbs.push(retriveBreadCrumbs({ topicPath: topic.path, allTopics, structure }));
      }
    });

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
          locale={locale}
          getSubjectTopics={this.getSubjectTopics}
          stageTaxonomyChanges={this.stageTaxonomyChanges}
        />
        {stagedTopicChanges.length > 0 &&
          !stagedTopicChanges.find(topic => topic.id === 'staged') && (
            <FilterConnections
              breadCrumbs={breadCrumbs}
              activeFilters={stagedFilterChanges}
              structure={structure}
              availableFilters={availableFilters}
              updateFilter={this.updateFilter}
            />
          )}
        {showWarning && (
          <FormikFieldHelp error>{t('errorMessage.unsavedTaxonomy')}</FormikFieldHelp>
        )}
        <Field right>
          <ActionButton outline onClick={this.onCancel} disabled={status === 'loading'}>
            {t('form.abort')}
          </ActionButton>
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
  locale: PropTypes.string,
  setIsOpen: PropTypes.func,
  article: ArticleShape.isRequired,
  updateNotes: PropTypes.func.isRequired,
};

export default injectT(TopicArticleTaxonomy);
