/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

import { actions, getDraft } from '../../modules/draft/draft';
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

class EditLearningResource extends Component {
  constructor(props) {
    super(props);
    this.state = { taxonomy: {} };
    this.updateDraft = this.updateDraft.bind(this);
    this.fetchTaxonony = this.fetchTaxonony.bind(this);
  }

  async componentWillMount() {
    const { articleId, fetchDraft, articleLanguage, fetchTags } = this.props;
    await this.fetchTaxonony(articleId, articleLanguage);
    fetchDraft({ id: articleId, language: articleLanguage });
    fetchTags({ language: articleLanguage });
  }

  async componentWillReceiveProps(nextProps) {
    const {
      articleId,
      fetchDraft,
      articleLanguage,
      article,
      fetchTags,
    } = nextProps;
    if (
      (article && article.language !== articleLanguage) ||
      articleId !== this.props.articleId
    ) {
      await this.fetchTaxonony(articleId, articleLanguage);
      fetchDraft({ id: articleId, language: articleLanguage });
      fetchTags({ language: articleLanguage });
    }
  }

  async fetchTaxonony(articleId, articleLanguage) {
    try {
      const resource = await queryResources(articleId, articleLanguage);
      if (resource) {
        const resourceTypes = await fetchResourceResourceType(
          resource[0].id,
          articleLanguage,
        );
        const filter = await fetchResourceFilter(
          resource[0].id,
          articleLanguage,
        );

        // Temporary method until API is simplified
        const allTopics = await fetchAllTopicResource(articleLanguage);
        const topicResource = allTopics.filter(
          item => item.resourceid === resource[0].id,
        );

        const topics = [];
        topicResource.forEach(async item => {
          const topicArticle = await fetchTopicArticle(
            item.topicid,
            articleLanguage,
          );
          topics.push({ ...topicArticle, primary: item.primary });
        });

        this.setState({
          taxonomy: { resourceTypes, filter, topics },
        });
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  updateDraft(article, taxonomy) {
    const { updateDraft } = this.props;
    updateDraft({ draft: article });
    updateTaxonomy(taxonomy);
  }

  render() {
    const { article, tags, isSaving, licenses } = this.props;
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
    return (
      <LearningResourceForm
        initialModel={getInitialModel(article, this.state.taxonomy)}
        revision={article.revision}
        articleStatus={article.status}
        tags={tags}
        licenses={licenses}
        isSaving={isSaving}
        onUpdate={this.updateDraft}
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
  articleLanguage: PropTypes.string.isRequired,
  fetchTags: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  fetchDraft: actions.fetchDraft,
  updateDraft: actions.updateDraft,
  setDraft: actions.setDraft,
  fetchTags: tagActions.fetchTags,
};

const mapStateToProps = (state, props) => {
  const { articleId, articleLanguage } = props;
  const getArticleSelector = getDraft(articleId, true);
  const getAllTagsSelector = getAllTagsByLanguage(articleLanguage);
  return {
    article: getArticleSelector(state),
    tags: getAllTagsSelector(state),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditLearningResource),
);
