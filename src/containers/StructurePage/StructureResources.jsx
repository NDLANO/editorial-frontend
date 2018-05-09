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
import { Button } from 'ndla-ui';
import { Plus } from 'ndla-icons/action';
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
  updateTopic,
} from '../../modules/taxonomy';
import { getArticle, searchArticles } from '../../modules/article/articleApi';
import Resource from './components/Resource';
import TaxonomyLightbox from './components/TaxonomyLightbox';
import { AsyncDropdown } from '../../components/Dropdown';

export class StructureResources extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      resourceTypes: [],
      topicResources: [],
      displayTopicDescription: true,
      showAddModal: false,
    };
    this.getAllResourceTypes = this.getAllResourceTypes.bind(this);
    this.getTopicResources = this.getTopicResources.bind(this);
    this.getArticle = this.getArticle.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.onArticleSearch = this.onArticleSearch.bind(this);
    this.onSelect = this.onSelect.bind(this);
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
    const { currentTopic, params: { topic1, topic2, topic3 } } = nextProps;
    if (nextProps.params !== this.props.params) {
      const topicId = topic3 || topic2 || topic1;
      this.getTopicResources(topicId);
    }
    if (
      currentTopic.contentUri &&
      currentTopic.contentUri !== this.props.currentTopic.contentUri
    ) {
      this.getArticle(currentTopic.contentUri);
    }
  }

  async onArticleSearch(input) {
    const response = await searchArticles(
      input,
      this.props.locale,
      'topic-article',
    );
    return response.results;
  }

  async onSelect(article) {
    const { currentTopic, refreshTopics } = this.props;
    const ok = await updateTopic({
      id: currentTopic.id,
      name: currentTopic.name,
      contentUri: `urn:article:${article.id}`,
    });
    if (ok) {
      refreshTopics();
      this.setState({ showAddModal: false });
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

  toggleAddModal() {
    this.setState(prevState => ({
      showAddModal: !prevState.showAddModal,
    }));
  }

  render() {
    const { params: { topic1, topic2, topic3 }, t } = this.props;
    return (
      <Fragment>
        <Accordion
          resourceGroup
          header="Emnebeskrivelse"
          hidden={!this.state.displayTopicDescription}
          addButton={
            <Button
              className="c-topic-resource__add-button"
              stripped
              onClick={this.toggleAddModal}>
              <Plus />
              {t('taxonomy.addTopicDescription')}
            </Button>
          }
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
        {this.state.showAddModal && (
          <TaxonomyLightbox
            title={t('taxonomy.searchArticle')}
            onClose={this.toggleAddModal}>
            <AsyncDropdown
              valueField="id"
              name="resourceSearch"
              textField="title.title"
              placeholder={t('form.content.relatedArticle.placeholder')}
              label="label"
              apiAction={this.onArticleSearch}
              messages={{
                emptyFilter: '',
                emptyList: t('taxonomy.noResources'),
              }}
              onChange={this.onSelect}
              alwaysOpen
            />
          </TaxonomyLightbox>
        )}
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
  locale: PropTypes.string.isRequired,
  params: PropTypes.shape({
    topic1: PropTypes.string,
    topic2: PropTypes.string,
  }).isRequired,
  currentTopic: PropTypes.shape({
    id: PropTypes.string,
    contentUri: PropTypes.string,
  }).isRequired,
};

export default injectT(StructureResources);
