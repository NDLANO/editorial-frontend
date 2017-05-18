/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { actions, getArticle } from './articleDucks';
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
    updateArticle(article);
  }

  render() {
    const { locale, article, tags } = this.props;

    if (!article) {
      return null;
    }
    return (
      <TopicArticleForm
        initialModel={getInitialModel(article)}
        tags={tags}
        locale={locale}
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
};

const mapDispatchToProps = {
  fetchArticle: actions.fetchArticle,
  updateArticle: actions.updateArticle,
};

const mapStateToProps = (state, props) => ({
  article: getArticle(props.articleId)(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditTopicArticle);
