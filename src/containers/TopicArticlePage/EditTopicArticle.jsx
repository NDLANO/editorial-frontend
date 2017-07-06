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
import TopicArticleForm, { getInitialModel } from './components/TopicArticleForm';
import { ArticleShape } from '../../shapes';

class EditTopicArticle extends Component {
  constructor(props) {
    super(props);
    this.updateArticle = this.updateArticle.bind(this);
  }

  componentWillMount() {
    const { articleId, fetchArticle } = this.props;
    fetchArticle(articleId);
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
      return <Redirect to="/forbidden" />;
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
  updateArticle: PropTypes.func.isRequired,
  article: ArticleShape,
  locale: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
  fetchArticle: actions.fetchArticle,
  updateArticle: actions.updateArticle,
};

const makeMapStateToProps = (_, props) => {
  const { articleId } = props;
  const getArticleSelector = getArticle(articleId);
  return state => ({
    article: getArticleSelector(state),
  });
};

export default connect(makeMapStateToProps, mapDispatchToProps)(
  EditTopicArticle,
);
