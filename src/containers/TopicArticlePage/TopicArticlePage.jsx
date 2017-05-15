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
import { EditorState } from 'draft-js';

import { actions, getArticle } from './articleDucks';
import { actions as tagActions, getAllTags } from '../Tag/tagDucks';
import { getLocale } from '../Locale/localeSelectors';
import TopicArticleForm from './components/TopicArticleForm';
import { ArticleShape } from '../../shapes';
import { convertHTMLToContentState } from './topicArticleContentConverter';

class TopicArticlePage extends Component {

  componentWillMount() {
    const { match: { params }, fetchArticle, fetchTags } = this.props;
    const { articleId } = params;
    fetchArticle(articleId);
    fetchTags();
    this.updateArticle = this.updateArticle.bind(this);
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
      <OneColumn cssModifier="narrow">
        <TopicArticleForm
          initialModel={{
            id: article.id,
            revision: article.revision,
            title: article.title || '',
            introduction: article.introduction || '',
            content: article.content ? convertHTMLToContentState(article.content) : EditorState.createEmpty(),
            tags: article.tags || [],
            authors: article.copyright.authors.map(author => author.name) || [],
            copyright: article.copyright,
            metaDescription: article.metaDescription || '',
          }}
          tags={tags}
          locale={locale}
          onUpdate={this.updateArticle}
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
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchArticle: PropTypes.func.isRequired,
  fetchTags: PropTypes.func.isRequired,
  updateArticle: PropTypes.func.isRequired,
  article: ArticleShape,
  token: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
};

const mapDispatchToProps = {
  fetchArticle: actions.fetchArticle,
  fetchTags: tagActions.fetchTags,
  updateArticle: actions.updateArticle,
};

const mapStateToProps = (state, props) => ({
  token: state.accessToken,
  article: getArticle(props.match.params.articleId)(state),
  locale: getLocale(state),
  tags: getAllTags(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(TopicArticlePage);
