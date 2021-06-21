/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, RefObject } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { spacing } from '@ndla/core';
import styled from '@emotion/styled';
import ResourceGroup from './ResourceGroup';
import { groupSortResourceTypesFromTopicResources } from '../../../util/taxonomyHelpers';
import { fetchAllResourceTypes, fetchTopicResources } from '../../../modules/taxonomy';
import handleError from '../../../util/handleError';
import TopicDescription from './TopicDescription';
import Spinner from '../../../components/Spinner';
import { fetchDraft } from '../../../modules/draft/draftApi';
import { fetchLearningpath } from '../../../modules/learningpath/learningpathApi';
import GroupTopicResources from '../folderComponents/GroupTopicResources';
import {
  ConceptStatusType,
  ResourceWithTopicConnection,
  Status,
  SubjectType,
} from '../../../interfaces';

const StyledDiv = styled('div')`
  width: calc(${spacing.large} * 4.5);
  margin-left: auto;
  margin-right: calc(${spacing.nsmall});
`;

interface BaseProps {
  locale: string;
  params: {
    topic1: string;
    topic2: string;
  };
  currentTopic: ResourceWithTopicConnection;
  refreshTopics: () => Promise<void>;
  resourceRef: RefObject<any>;
  currentSubject: SubjectType;
  structure: SubjectType[];
  resourcesUpdated: boolean;
  setResourcesUpdated: Function;
  saveSubjectTopicItems: (a: string, b: string, c: string) => void;
}

type Props = BaseProps & tType;

interface State {
  resourceTypes: any[];
  topicResources: any[];
  loading: boolean;
  topicDescription?: string;
  topicStatus?: Status;
}

export class StructureResources extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      resourceTypes: [],
      topicResources: [],
      loading: false,
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

  componentDidUpdate(prevProps: Props) {
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

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (!nextProps.currentTopic.contentUri && prevState.topicDescription) {
      return {
        topicDescription: undefined,
      };
    }
    return null;
  }

  async getArticle(contentUri: string, locale?: string) {
    try {
      const article = await fetchDraft(parseInt(contentUri.replace('urn:article:', '')), locale);
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
    const { resourceTypes } = this.state;
    if (topicId) {
      try {
        this.setState({ loading: true });
        const initialTopicResources: ResourceWithTopicConnection[] = await fetchTopicResources(
          topicId,
          locale,
          undefined,
        );

        if (currentTopic.contentUri) {
          fetchDraft(parseInt(currentTopic.contentUri.replace('urn:article:', '')), locale).then(
            article =>
              this.setState({
                topicStatus: article.status,
              }),
          );
        }
        await this.getResourceStatuses(initialTopicResources);

        const topicResources = groupSortResourceTypesFromTopicResources(
          resourceTypes,
          initialTopicResources,
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

  async getResourceStatuses(allTopicResources: ResourceWithTopicConnection[]) {
    const resourcePromises = allTopicResources.map(async resource => {
      if (resource.contentUri) {
        const [, resourceType, id] = resource.contentUri.split(':');
        if (resourceType === 'article') {
          const article = await fetchDraft(parseInt(id), this.props.locale);
          resource.status = article.status;
          return article;
        } else if (resourceType === 'learningpath') {
          const learningpath = await fetchLearningpath(parseInt(id), this.props.locale, true);
          resource.status = { current: learningpath.status as ConceptStatusType, other: [] };
          return learningpath;
        }
      }
    });
    await Promise.all(resourcePromises);
  }

  render() {
    const {
      locale,
      refreshTopics,
      currentTopic,
      resourceRef,
      currentSubject,
      saveSubjectTopicItems,
    } = this.props;
    const { topicDescription, resourceTypes, topicResources, topicStatus, loading } = this.state;
    if (loading) {
      return <Spinner />;
    }
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
        {resourceTypes.map(resourceType => {
          const topicResource =
            topicResources.find(resource => resource.id === resourceType.id) || {};
          return (
            <ResourceGroup
              key={resourceType.id}
              resource={resourceType}
              topicResource={topicResource}
              params={this.props.params}
              refreshResources={this.getTopicResources}
              locale={locale}
              currentSubject={currentSubject}
            />
          );
        })}
      </Fragment>
    );
  }
}

export default injectT(StructureResources);
