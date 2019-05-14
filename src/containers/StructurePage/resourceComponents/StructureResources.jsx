/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import ResourceGroup from './ResourceGroup';
import {
  RESOURCE_FILTER_CORE,
  RESOURCE_FILTER_SUPPLEMENTARY,
} from '../../../constants';
import { groupSortResourceTypesFromTopicResources } from '../../../util/taxonomyHelpers';
import {
  fetchAllResourceTypes,
  fetchTopicResources,
} from '../../../modules/taxonomy';
import handleError from '../../../util/handleError';
import { getArticle } from '../../../modules/article/articleApi';

import TopicDescription from './TopicDescription';
import Spinner from '../../../components/Spinner';

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
    } = this.props;
    if (id !== prevProps.currentTopic.id) {
      this.getTopicResources();
    } else if (activeFilters.length !== prevProps.activeFilters.length) {
      this.getTopicResources();
    }
    if (contentUri && contentUri !== prevProps.currentTopic.contentUri) {
      this.getArticle(contentUri);
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

  async getTopicResources() {
    const {
      currentTopic: { id: topicId },
      locale,
      activeFilters,
    } = this.props;
    const { resourceTypes } = this.state;
    if (topicId) {
      try {
        this.setState({ loading: true });
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
        this.setState({ topicResources, loading: false });
      } catch (error) {
        handleError(error);
        this.setState({ loading: false });
      }
    } else {
      this.setState({ topicResources: [], loading: false });
    }
  }

  render() {
    const {
      activeFilters,
      locale,
      refreshTopics,
      currentTopic,
      refFunc,
      currentSubject,
    } = this.props;
    const {
      topicDescription,
      resourceTypes,
      topicResources,
      loading,
    } = this.state;
    if (loading) return <Spinner />;
    return (
      <Fragment>
        <TopicDescription
          topicDescription={topicDescription}
          locale={locale}
          refFunc={refFunc}
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
              refreshResources={this.getTopicResources}
              activeFilter={activeFilters.length === 1 ? activeFilters[0] : ''}
              locale={locale}
              currentTopic={currentTopic}
              currentSubject={currentSubject}
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
  refFunc: PropTypes.func,
  currentSubject: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
};

export default StructureResources;
