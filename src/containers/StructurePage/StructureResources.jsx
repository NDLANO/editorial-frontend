/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import ResourceGroup from './components/ResourceGroup';
import {
  RESOURCE_FILTER_CORE,
  RESOURCE_FILTER_SUPPLEMENTARY,
} from '../../constants';
import { groupSortResourceTypesFromTopicResources } from '../../util/taxonomyHelpers';
import {
  fetchAllResourceTypes,
  fetchTopicResources,
} from '../../modules/taxonomy';
import handleError from '../../util/handleError';
import { getArticle } from '../../modules/article/articleApi';

import TopicDescription from './components/TopicDescription';

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
      await this.getAllResourceTypes();
      if (currentTopic.id) {
        this.getTopicResources(currentTopic.id);
      }
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
    } = this.props;
    if (id !== prevProps.currentTopic.id) {
      this.getTopicResources(id, activeFilters);
      if (contentUri && contentUri !== prevProps.currentTopic.contentUri) {
        this.getArticle(contentUri);
      }
    } else if (activeFilters !== prevProps.activeFilters) {
      this.getTopicResources(id, activeFilters);
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
      const article = await getArticle(contentUri.replace('urn:article:', ''));
      this.setState({ topicDescription: article.title && article.title.title });
    } catch (error) {
      handleError(error);
    }
  }

  async getAllResourceTypes() {
    try {
      const resourceTypes = await fetchAllResourceTypes(this.props.locale);
      this.setState({ resourceTypes });
    } catch (error) {
      handleError(error);
    }
  }

  async getTopicResources(topicId, activeFilters = this.props.activeFilters) {
    if (topicId) {
      const { locale } = this.props;
      const { resourceTypes } = this.state;
      try {
        const [
          coreTopicResources = [],
          supplementaryTopicResources = [],
        ] = await Promise.all([
          fetchTopicResources(
            topicId,
            locale,
            RESOURCE_FILTER_CORE,
            activeFilters.join(','),
          ),
          fetchTopicResources(
            topicId,
            locale,
            RESOURCE_FILTER_SUPPLEMENTARY,
            activeFilters.join(','),
          ),
        ]);

        const topicResources = groupSortResourceTypesFromTopicResources(
          resourceTypes,
          coreTopicResources,
          supplementaryTopicResources,
        );
        this.setState({ topicResources });
      } catch (error) {
        handleError(error);
      }
    } else {
      this.setState({ topicResources: [] });
    }
  }

  render() {
    const { activeFilters, locale, refreshTopics, currentTopic } = this.props;
    const { topicDescription, resourceTypes, topicResources } = this.state;

    return (
      <Fragment>
        <TopicDescription
          topicDescription={topicDescription}
          locale={locale}
          refreshTopics={refreshTopics}
          currentTopic={currentTopic}
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
              refreshResources={() => this.getTopicResources(currentTopic.id)}
              activeFilter={activeFilters.length === 1 ? activeFilters[0] : ''}
              locale={locale}
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
};

export default StructureResources;
