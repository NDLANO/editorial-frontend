/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

import { actions, getDraft } from '../../modules/draft/draft';
import * as messageActions from '../Messages/messagesActions';
import {
  queryResources,
  fetchResourceResourceType,
  fetchResourceFilter,
  fetchAllTopicResource,
  fetchTopicArticle,
  updateTaxonomy,
} from '../../modules/taxonomy';
import LearningResourceForm, {
  getInitialModel,
} from './components/LearningResourceForm';
import { ArticleShape, LicensesArrayOf } from '../../shapes';
import { toEditArticle } from '../../util/routeHelpers';
import {
  actions as tagActions,
  getAllTagsByLanguage,
} from '../../modules/tag/tag';
import handleError from '../../util/handleError';

class EditLearningResource extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      taxonomy: { resourceTypes: [], filter: [], topics: [], loading: true },
      allTopics: [],
    };
    this.updateLearningResource = this.updateLearningResource.bind(this);
    this.fetchTaxonony = this.fetchTaxonony.bind(this);
    this.createMessage = this.createMessage.bind(this);
  }

  componentDidMount() {
    const { articleId, fetchDraft, selectedLanguage } = this.props;
    fetchDraft({ id: articleId, language: selectedLanguage });
    this.fetchTaxonony(articleId, selectedLanguage);
  }

  async componentDidUpdate({
    selectedLanguage: prevLanguage,
    articleId: prevArticleId,
    article: prevArticle,
  }) {
    const {
      articleId,
      fetchDraft,
      selectedLanguage,
      article,
      fetchTags,
    } = this.props;

    if (prevLanguage !== selectedLanguage || articleId !== prevArticleId) {
      fetchDraft({ id: articleId, language: selectedLanguage });
      this.fetchTaxonony(articleId, selectedLanguage);
    }
    if (article && (!prevArticle || article.id !== prevArticle.id)) {
      fetchTags({ language: article.language });
    }
  }

  async fetchTaxonony(articleId, articleLanguage) {
    try {
      const resource = await queryResources(articleId, articleLanguage);
      if (resource.length > 0) {
        const [resourceTypes, filter] = await Promise.all([
          fetchResourceResourceType(resource[0].id, articleLanguage),
          fetchResourceFilter(resource[0].id, articleLanguage),
        ]);

        // Temporary method until API is simplified
        const allTopics = await fetchAllTopicResource(articleLanguage);
        const topicResource = allTopics.filter(
          item => item.resourceId === resource[0].id,
        );

        const topics = await Promise.all(
          topicResource.map(async item => {
            const topicArticle = await fetchTopicArticle(
              item.topicid,
              articleLanguage,
            );
            return { ...topicArticle, primary: item.primary };
          }),
        );
        this.setState({
          taxonomy: { resourceTypes, filter, topics, loading: false },
          allTopics,
        });
      } else {
        this.setState({
          taxonomy: { loading: false },
        });
      }
    } catch (e) {
      handleError(e);
    }
  }

  updateLearningResource(article, taxonomy) {
    const { updateDraft } = this.props;
    updateDraft({ draft: article });
    updateTaxonomy(taxonomy, this.state.allTopics);
  }

  createMessage(message = {}) {
    const { addMessage } = this.props;
    addMessage(message);
  }

  render() {
    const { article, selectedLanguage, ...rest } = this.props;
    if (!article) {
      return null;
    }
    if (article.articleType !== 'standard') {
      return (
        <Redirect
          to={toEditArticle(article.id, article.articleType, article.language)}
        />
      );
    }
    const language = article.supportedLanguages.includes(selectedLanguage)
      ? article.language
      : selectedLanguage;
    return (
      <LearningResourceForm
        initialModel={getInitialModel(article, this.state.taxonomy, language)}
        taxonomy={this.state.taxonomy}
        selectedLanguage={selectedLanguage}
        revision={article.revision}
        articleStatus={article.status}
        onUpdate={this.updateLearningResource}
        taxonomyIsLoading={this.state.taxonomy.loading}
        createMessage={this.createMessage}
        {...rest}
      />
    );
  }
}

EditLearningResource.propTypes = {
  articleId: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  licenses: LicensesArrayOf,
  fetchDraft: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,
  article: ArticleShape,
  locale: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  setDraft: PropTypes.func.isRequired,
  selectedLanguage: PropTypes.string.isRequired,
  fetchTags: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  addMessage: messageActions.addMessage,
  fetchDraft: actions.fetchDraft,
  updateDraft: actions.updateDraft,
  setDraft: actions.setDraft,
  fetchTags: tagActions.fetchTags,
};

const mapStateToProps = (state, props) => {
  const { articleId } = props;
  const getArticleSelector = getDraft(articleId, true);
  const article = getArticleSelector(state);
  const getAllTagsSelector = getAllTagsByLanguage(
    article ? article.language : '',
  );
  return {
    article,
    tags: getAllTagsSelector(state),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(EditLearningResource),
);
