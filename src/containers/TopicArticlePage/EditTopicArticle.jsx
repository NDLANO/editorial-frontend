/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { actions as draftActions, getDraft } from '../../modules/draft/draft';
import TopicArticleForm, {
  getInitialModel,
} from './components/TopicArticleForm';
import { ArticleShape, LicensesArrayOf } from '../../shapes';
import { toEditArticle } from '../../util/routeHelpers';
import {
  actions as tagActions,
  getAllTagsByLanguage,
} from '../../modules/tag/tag';

class EditTopicArticle extends Component {
  constructor(props) {
    super(props);
    this.updateDraft = this.updateDraft.bind(this);
  }

  componentWillMount() {
    const { articleId, fetchDraft, articleLanguage, fetchTags } = this.props;
    fetchDraft({ id: articleId, language: articleLanguage });
    fetchTags({ language: articleLanguage });
  }

  componentWillReceiveProps(nextProps) {
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
      fetchDraft({ id: articleId, language: articleLanguage });
      fetchTags({ language: articleLanguage });
    }
  }

  updateDraft(article) {
    const { updateDraft } = this.props;
    updateDraft({ draft: article });
  }

  render() {
    const { article, ...rest } = this.props;
    if (!article) {
      return null;
    }

    if (article.articleType !== 'topic-article') {
      return (
        <Redirect
          to={toEditArticle(article.id, article.articleType, article.language)}
        />
      );
    }
    return (
      <TopicArticleForm
        initialModel={getInitialModel(article)}
        revision={article.revision}
        articleStatus={article.status}
        onUpdate={this.updateDraft}
        {...rest}
      />
    );
  }
}

EditTopicArticle.propTypes = {
  articleId: PropTypes.string.isRequired,
  fetchDraft: PropTypes.func.isRequired,
  fetchTags: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,
  article: ArticleShape,
  articleLanguage: PropTypes.string.isRequired,
};

const mapDispatchToProps = {
  fetchDraft: draftActions.fetchDraft,
  updateDraft: draftActions.updateDraft,
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

export default connect(mapStateToProps, mapDispatchToProps)(EditTopicArticle);
