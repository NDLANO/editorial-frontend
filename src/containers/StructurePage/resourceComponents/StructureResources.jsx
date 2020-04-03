/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';

import ResourceGroup from './ResourceGroup';
import { groupSortResourceTypesFromTopicResources } from '../../../util/taxonomyHelpers';
import {
  fetchAllResourceTypes,
  fetchTopicResources,
} from '../../../modules/taxonomy';
import handleError from '../../../util/handleError';
import TopicDescription from './TopicDescription';
import Spinner from '../../../components/Spinner';
import { fetchDraft } from '../../../modules/draft/draftApi';
import { fetchLearningpath } from '../../../modules/learningpath/learningpathApi';

export class StructureResources extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      resourceTypes: [],
      topicResources: [],
    };
    this.getAllResourceTypes = this.getAllResourceTypes.bind(this);
    this.getTopicResources = this.getTopicResources.bind(this);
    this.getArticle = this.getArticle.bind(this);
  }
 
  async componentDidMount() {
    try {
      const { currentTopic } = this.props;
      this.setState({ loading: true });
      await this.getAllResourceTypes();

      this.getTopicResources();

      if (currentTopic.contentUri) {
        this.getArticle(currentTopic.contentUri);
      }
    } catch (error) {
      handleError(error);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      currentTopic: { id, contentUri },
      activeFilters,
      resourcesUpdated,
      setResourcesUpdated,
    } = this.props;
    if (
      id !== prevProps.currentTopic.id ||
      activeFilters.length !== prevProps.activeFilters.length ||
      resourcesUpdated
    ) {
      this.getTopicResources();
    }
    if (contentUri && contentUri !== prevProps.currentTopic.contentUri) {
      this.getArticle(contentUri);
    }
    if (resourcesUpdated) {
      setResourcesUpdated(false);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.currentTopic.contentUri && prevState.topicDescription) {
      return {
        topicDescription: undefined,
      };
    }
    return null;
  }

  async getArticle(contentUri) {
    try {
      const article = await fetchDraft(contentUri.replace('urn:article:', ''));
      this.setState({ topicDescription: article.title && article.title.title });
    } catch (error) {
      handleError(error);
    }
  }

  async getAllResourceTypes() {
    const { t } = this.props;
    try {
      const resourceTypes = await fetchAllResourceTypes(this.props.locale);
      resourceTypes.push({
        id: 'missing',
        name: t('taxonomy.missingResourceType'),
        disabled: true,
      });
      this.setState({ resourceTypes });
    } catch (error) {
      handleError(error);
    }
  }

  async getTopicResources() {
    const {
      currentTopic: { id: topicId },
      locale,
      activeFilters,
      currentTopic,
    } = this.props;
    const { resourceTypes } = this.state;
    if (topicId) {
      try {
        this.setState({ loading: true });
        const initialTopicResources = await fetchTopicResources(
          topicId,
          locale,
          undefined,
          activeFilters.join(','),
        );
        const allTopicResources = initialTopicResources.map(r => {
          if (r.resourceTypes.length > 0) {
            return r;
          } else {
            return { ...r, resourceTypes: [{ id: 'missing' }] };
          }
        });

        if (currentTopic.contentUri) {
          fetchDraft(currentTopic.contentUri.replace('urn:article:', '')).then(
            article =>
              this.setState({
                topicStatus: article.status.current,
              }),
          );
        }
        this.getResourceStatuses(allTopicResources);

        const topicResources = groupSortResourceTypesFromTopicResources(
          resourceTypes,
          allTopicResources,
        );
        this.setState({ topicResources, loading: false });
      } catch (error) {
        handleError(error);
        this.setState({ loading: false });
      }
    } else {
      this.setState({ topicResources: [], loading: false });
    }
  }

  async getResourceStatuses(allTopicResources) {
    const resourcePromises = allTopicResources.map(async resource => {
      if (resource.contentUri) {
        const [, resourceType, id] = resource.contentUri.split(':');
        if (resourceType === 'article') {
          const article = await fetchDraft(id);
          resource.status = article.status.current;
          return article;
        } else if (resourceType === 'learningpath') {
          const learningpath = await fetchLearningpath(id);
          resource.status = learningpath.status;
          return learningpath;
        }
      }
    });
    await Promise.all(resourcePromises);
    const topicResources = groupSortResourceTypesFromTopicResources(
      this.state.resourceTypes,
      allTopicResources,
    );
    this.setState({ topicResources });
  }

  render() {
    const {
      activeFilters,
      locale,
      refreshTopics,
      currentTopic,
      resourceRef,
      currentSubject,
    } = this.props;
    const {
      topicDescription,
      resourceTypes,
      topicResources,
      topicStatus,
      loading,
    } = this.state;
    if (loading) {
      return <Spinner />;
    }
    return (
      <Fragment>
        <TopicDescription
          topicDescription={topicDescription}
          locale={locale}
          resourceRef={resourceRef}
          refreshTopics={refreshTopics}
          currentTopic={currentTopic}
          status={topicStatus}
        />
        {resourceTypes.map(resourceType => {
          const topicResource =
            topicResources.find(resource => resource.id === resourceType.id) ||
            {};
          return (
            <ResourceGroup
              key={resourceType.id}
              resource={resourceType}
              topicResource={topicResource}
              params={this.props.params}
              refreshResources={this.getTopicResources}
              activeFilter={activeFilters.length === 1 ? activeFilters[0] : ''}
              locale={locale}
              currentTopic={currentTopic}
              currentSubject={currentSubject}
              disable={resourceType.disabled}
            />
          );
        })}
      </Fragment>
    );
  }
}

StructureResources.propTypes = {
  locale: PropTypes.string.isRequired,
  params: PropTypes.shape({
    topic1: PropTypes.string,
    topic2: PropTypes.string,
  }).isRequired,
  currentTopic: PropTypes.shape({
    id: PropTypes.string,
    contentUri: PropTypes.string,
  }).isRequired,
  refreshTopics: PropTypes.func,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  resourceRef: PropTypes.object,
  currentSubject: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  resourcesUpdated: PropTypes.bool,
  setResourcesUpdated: PropTypes.func,
};

export default injectT(StructureResources);
