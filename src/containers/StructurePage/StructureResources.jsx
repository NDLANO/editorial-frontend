/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import Accordion from '../../components/Accordion';

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
import Resource from './components/Resource';

export class StructureResources extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      resourceTypes: [],
      topicResources: [],
      displayTopicDescription: true,
    };
    this.getAllResourceTypes = this.getAllResourceTypes.bind(this);
    this.getTopicResources = this.getTopicResources.bind(this);
    this.getArticle = this.getArticle.bind(this);
  }

  async componentDidMount() {
    try {
      const { params: { topic1, topic2, topic3 }, contentUri } = this.props;
      await this.getAllResourceTypes();
      const topicId = topic3 || topic2 || topic1;
      this.getTopicResources(topicId);
      if (contentUri) {
        this.getArticle(contentUri);
      }
    } catch (error) {
      console.log(error);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { contentUri, params: { topic1, topic2, topic3 } } = nextProps;
    if (nextProps.params !== this.props.params) {
      const topicId = topic3 || topic2 || topic1;
      this.getTopicResources(topicId);
    }
    if (contentUri !== this.props.contentUri) {
      this.getArticle(contentUri);
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

  async getTopicResources(topicId) {
    if (topicId) {
      const { locale } = this.props;
      const { resourceTypes } = this.state;
      const fullId = `urn:${topicId}`;
      try {
        const [
          coreTopicResources = [],
          supplementaryTopicResources = [],
        ] = await Promise.all([
          fetchTopicResources(fullId, locale, RESOURCE_FILTER_CORE),
          fetchTopicResources(fullId, locale, RESOURCE_FILTER_SUPPLEMENTARY),
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
    const { params: { topic1, topic2, topic3 } } = this.props;
    return (
      <Fragment>
        <Accordion
          resourceGroup
          header="Emnebeskrivelse"
          hidden={!this.state.displayTopicDescription}
          handleToggle={() =>
            this.setState(prevState => ({
              displayTopicDescription: !prevState.displayTopicDescription,
            }))
          }>
          {this.state.topicDescription && (
            <Resource
              contentType="subject"
              name={this.state.topicDescription}
            />
          )}
        </Accordion>
        {/* this.state.showAddModal && (
          <AddResourceModal
            type={resource.id}
            topicId={params.topic3 || params.topic2 || params.topic1}
            refreshResources={refreshResources}
            onClose={this.toggleAddModal}
          />
        ) */}
        {this.state.resourceTypes.map(resourceType => {
          const topicResource =
            this.state.topicResources.find(
              resource => resource.id === resourceType.id,
            ) || {};
          return (
            <ResourceGroup
              key={resourceType.id}
              resource={resourceType}
              topicResource={topicResource}
              params={this.props.params}
              refreshResources={() =>
                this.getTopicResources(topic3 || topic2 || topic1)
              }
            />
          );
        })}
      </Fragment>
    );
  }
}

StructureResources.propTypes = {
  locale: PropTypes.string,
  params: PropTypes.shape({
    topic1: PropTypes.string,
    topic2: PropTypes.string,
  }).isRequired,
  contentUri: PropTypes.string,
};

export default injectT(StructureResources);
