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

import { actions, getArticle } from '../../modules/article/article';
import TopicArticleForm, {
  getInitialModel,
} from './components/TopicArticleForm';
import { ArticleShape } from '../../shapes';
import { toEditArticle } from '../../util/routeHelpers';
import {
  actions as tagActions,
  getAllTagsByLanguage,
} from '../../modules/tag/tag';

class EditTopicArticle extends Component {
  constructor(props) {
    super(props);
    this.updateArticle = this.updateArticle.bind(this);
  }

  componentWillMount() {
    const { articleId, fetchArticle, articleLanguage, fetchTags } = this.props;
    fetchArticle({ id: articleId, language: articleLanguage });
    fetchTags({ language: articleLanguage });
  }

  componentWillReceiveProps(nextProps) {
    const {
      articleId,
      fetchArticle,
      articleLanguage,
      article,
      fetchTags,
    } = nextProps;
    if (
      (article && article.language !== articleLanguage) ||
      articleId !== this.props.articleId
    ) {
      fetchArticle({ id: articleId, language: articleLanguage });
      fetchTags({ language: articleLanguage });
    }
  }

  updateArticle(article) {
    const { updateArticle } = this.props;
    updateArticle({ article });
  }

  render() {
    const { locale, article, tags, isSaving } = this.props;
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
        tags={tags}
        locale={locale}
        isSaving={isSaving}
        onUpdate={this.updateArticle}
      />
    );
  }
}

EditTopicArticle.propTypes = {
  articleId: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchArticle: PropTypes.func.isRequired,
  fetchTags: PropTypes.func.isRequired,
  updateArticle: PropTypes.func.isRequired,
  article: ArticleShape,
  locale: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  articleLanguage: PropTypes.string.isRequired,
};

const mapDispatchToProps = {
  fetchArticle: actions.fetchArticle,
  updateArticle: actions.updateArticle,
  fetchTags: tagActions.fetchTags,
};

const mapStateToProps = (state, props) => {
  const { articleId, articleLanguage } = props;
  const getArticleSelector = getArticle(articleId, true);
  const getAllTagsSelector = getAllTagsByLanguage(articleLanguage);
  return {
    article: getArticleSelector(state),
    tags: getAllTagsSelector(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTopicArticle);
