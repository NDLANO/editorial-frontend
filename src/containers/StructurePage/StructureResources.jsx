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
      const { params: { topic1, topic2, topic3 }, currentTopic } = this.props;
      await this.getAllResourceTypes();
      const topicId = topic3 || topic2 || topic1;
      this.getTopicResources(topicId);
      if (currentTopic.contentUri) {
        this.getArticle(currentTopic.contentUri);
      }
    } catch (error) {
      console.log(error);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      currentTopic,
      params: { topic1, topic2, topic3 },
      activeFilters,
    } = nextProps;
    if (
      nextProps.params !== this.props.params ||
      activeFilters !== this.props.activeFilters
    ) {
      const topicId = topic3 || topic2 || topic1;
      this.getTopicResources(topicId, activeFilters);
    }
    if (
      currentTopic.contentUri &&
      currentTopic.contentUri !== this.props.currentTopic.contentUri
    ) {
      this.getArticle(currentTopic.contentUri);
    }
  }

  async getArticle(contentUri) {
    const article = await getArticle(contentUri.replace('urn:article:', ''));
    this.setState({ topicDescription: article.title && article.title.title });
  }

  async getAllResourceTypes() {
    try {
      const resourceTypes = await fetchAllResourceTypes(this.props.locale);
      this.setState({ resourceTypes });
    } catch (error) {
      console.log(error);
    }
  }

  async getTopicResources(topicId, activeFilters = this.props.activeFilters) {
    if (topicId) {
      const { locale } = this.props;
      const { resourceTypes } = this.state;
      const fullId = `urn:${topicId}`;
      try {
        const [
          coreTopicResources = [],
          supplementaryTopicResources = [],
        ] = await Promise.all([
          fetchTopicResources(
            fullId,
            locale,
            RESOURCE_FILTER_CORE,
            activeFilters.join(','),
          ),
          fetchTopicResources(
            fullId,
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
        console.log(error);
      }
    } else {
      this.setState({ topicResources: [] });
    }
  }

  render() {
    const {
      params: { topic1, topic2, topic3 },
      activeFilters,
      locale,
      refreshTopics,
      currentTopic,
    } = this.props;

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
              refreshResources={() =>
                this.getTopicResources(topic3 || topic2 || topic1)
              }
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
