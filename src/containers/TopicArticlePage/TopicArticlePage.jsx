/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { OneColumn } from 'ndla-ui';

import { actions, getArticle } from './articleDucks';
import { getLocale } from '../Locale/localeSelectors';
import TopicArticleForm from './components/TopicArticleForm';
import { ArticleShape } from '../../shapes';

class TopicArticlePage extends Component {

  componentWillMount() {
    const { match: { params }, fetchArticle } = this.props;
    const { articleId } = params;
    fetchArticle(articleId);
  }

  render() {
    const { locale, article } = this.props;

    return (
      <OneColumn cssModifier="narrow">
        <TopicArticleForm
          locale={locale}
          article={article}
          onUpdate={() => {}}
        />

      </OneColumn>
    );
  }
}

TopicArticlePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      articleId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  fetchArticle: PropTypes.func.isRequired,
  article: ArticleShape,
  locale: PropTypes.string.isRequired,
};

const mapDispatchToProps = {
  fetchArticle: actions.fetchArticle,
};

const mapStateToProps = (state, props) => ({
  article: getArticle(props.match.params.articleId)(state),
  locale: getLocale(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(TopicArticlePage);
