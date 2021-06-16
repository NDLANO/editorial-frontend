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
import { spacing } from '@ndla/core';
import styled from '@emotion/styled';
import ResourceGroup from './ResourceGroup';
import AllResourcesGroup from './AllResourcesGroup';
import { groupSortResourceTypesFromTopicResources } from '../../../util/taxonomyHelpers';
import { fetchAllResourceTypes, fetchTopicResources, fetchTopic } from '../../../modules/taxonomy';
import handleError from '../../../util/handleError';
import TopicDescription from './TopicDescription';
import Spinner from '../../../components/Spinner';
import { fetchDraft } from '../../../modules/draft/draftApi';
import { fetchLearningpath } from '../../../modules/learningpath/learningpathApi';

import { StructureShape } from '../../../shapes';
import GroupTopicResources from '../folderComponents/GroupTopicResources';

const StyledDiv = styled('div')`
  width: calc(${spacing.large} * 4.5);
  margin-left: auto;
  margin-right: calc(${spacing.nsmall});
`;

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
      resourcesUpdated,
      setResourcesUpdated,
      locale,
    } = this.props;
    if (id !== prevProps.currentTopic.id || resourcesUpdated) {
      this.getTopicResources();
    }
    if (contentUri && contentUri !== prevProps.currentTopic.contentUri) {
      this.getArticle(contentUri, locale);
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

  async getArticle(contentUri, locale) {
    try {
      const article = await fetchDraft(contentUri.replace('urn:article:', ''), locale);
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
      currentTopic,
    } = this.props;
    if (topicId) {
      try {
        this.setState({ loading: true });
        const initialTopicResources = await fetchTopicResources(topicId, locale, undefined);
        const allTopicResources = await Promise.all(
          initialTopicResources.map(async r => {
            const breadCrumbs = await this.getCrumbsFromPath(r);
            if (r.resourceTypes.length > 0) {
              return { ...r, breadCrumbs };
            } else {
              return { ...r, resourceTypes: [{ id: 'missing' }], breadCrumbs };
            }
          }),
        );

        if (currentTopic.contentUri) {
          fetchDraft(currentTopic.contentUri.replace('urn:article:', ''), locale).then(article =>
            this.setState({
              topicStatus: article.status,
            }),
          );
        }
        await this.getResourceStatuses(allTopicResources);

        this.setState({ topicResources: allTopicResources, loading: false });
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
          const article = await fetchDraft(id, this.props.locale);
          resource.status = article.status;
          return article;
        } else if (resourceType === 'learningpath') {
          const learningpath = await fetchLearningpath(id, this.props.locale, true);
          resource.status = { current: learningpath.status };
          return learningpath;
        }
      }
    });
    await Promise.all(resourcePromises);
  }

  async getCrumbsFromPath(resource) {
    const breadCrumbs = [];
    if (resource.paths) {
      resource.paths.forEach(async path => {
        breadCrumbs.push([
          this.props.structure.find(
            structureItem => structureItem.id === `urn:${path.split('/')[1]}`,
          ),
          ...(await Promise.all(
            path
              .split('/')
              .slice(2, -1)
              .map(topicId => fetchTopic(`urn:${topicId}`)),
          )),
        ]);
      });
    } else {
      breadCrumbs.push([
        this.props.structure.find(
          structureItem => structureItem.id === `urn:${resource.path.split('/')[1]}`,
        ),
        ...(await Promise.all(
          resource.path
            .split('/')
            .slice(2, -1)
            .map(topicId => fetchTopic(`urn:${topicId}`)),
        )),
      ]);
    }
    return breadCrumbs;
  }

  render() {
    const {
      locale,
      refreshTopics,
      currentTopic,
      resourceRef,
      currentSubject,
      structure,
      saveSubjectTopicItems,
      grouped,
    } = this.props;
    const { topicDescription, resourceTypes, topicResources, topicStatus, loading } = this.state;
    if (loading) {
      return <Spinner />;
    }

    const groupedTopicResources = groupSortResourceTypesFromTopicResources(
      resourceTypes,
      topicResources,
    );

    return (
      <Fragment>
        {currentTopic.id && (
          <StyledDiv>
            <GroupTopicResources
              topicId={currentTopic.id}
              subjectId={`urn:${currentTopic.path.split('/')[1]}`}
              metadata={currentTopic.metadata}
              updateLocalTopics={saveSubjectTopicItems}
              hideIcon
            />
          </StyledDiv>
        )}
        <TopicDescription
          topicDescription={topicDescription}
          locale={locale}
          resourceRef={resourceRef}
          refreshTopics={refreshTopics}
          currentTopic={currentTopic}
          status={topicStatus}
        />
        {topicResources.length > 0 && grouped === 'grouped' && (
          <AllResourcesGroup
            key="ungrouped"
            params={this.props.params}
            topicResources={topicResources}
            refreshResources={this.getTopicResources}
            locale={locale}
            currentTopic={currentTopic}
            currentSubject={currentSubject}
            structure={structure}
            resourceTypes={resourceTypes}
          />
        )}
        {grouped === 'ungrouped' &&
          resourceTypes.map(resourceType => {
            const topicResource =
              groupedTopicResources.find(resource => resource.id === resourceType.id) || {};
            return (
              <ResourceGroup
                key={resourceType.id}
                resourceType={resourceType}
                topicResource={topicResource}
                params={this.props.params}
                refreshResources={this.getTopicResources}
                locale={locale}
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
    metadata: PropTypes.object,
    path: PropTypes.string,
  }).isRequired,
  refreshTopics: PropTypes.func,
  resourceRef: PropTypes.object,
  currentSubject: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  structure: PropTypes.arrayOf(StructureShape),
  resourcesUpdated: PropTypes.bool,
  setResourcesUpdated: PropTypes.func,
  saveSubjectTopicItems: PropTypes.func,
  grouped: PropTypes.string,
};

export default injectT(StructureResources);
