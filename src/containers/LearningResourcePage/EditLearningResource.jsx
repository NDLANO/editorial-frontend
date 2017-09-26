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
import LearningResourceForm, {
  getInitialModel,
} from './components/LearningResourceForm';
import { ArticleShape } from '../../shapes';
import { toEditArticle } from '../../util/routeHelpers';

class EditLearningResource extends Component {
  constructor(props) {
    super(props);
    this.updateArticle = this.updateArticle.bind(this);
    this.onVariantClick = this.onVariantClick.bind(this);
  }

  componentWillMount() {
    const { articleId, fetchArticle, articleLanguage } = this.props;
    fetchArticle({ id: articleId, language: articleLanguage });
  }

  onVariantClick(languageKey) {
    const { article, fetchArticle, setArticle } = this.props;
    if (article.supportedLanguages.find(lang => lang === languageKey)) {
      fetchArticle({ id: article.id, language: languageKey })
    } else {
      setArticle({
        id: article.id,
        language: languageKey,
        copyright: article.copyright,
        articleType: 'standard',
        revision: article.revision,
        supportedLanguages: article.supportedLanguages,
      });
    }
  }

  updateArticle(article) {
    const { updateArticle } = this.props;
    updateArticle({ article });
  }

  render() {
    const {
      article,
      tags,
      isSaving,
      licenses,
    } = this.props;
    if (!article) {
      return null;
    }

    if (article.articleType !== 'standard') {
      return <Redirect to={toEditArticle(article.id, article.articleType, article.language)} />;
    }
    return (
      <LearningResourceForm
        initialModel={getInitialModel(article)}
        revision={article.revision}
        tags={tags}
        licenses={licenses}
        isSaving={isSaving}
        onUpdate={this.updateArticle}
        onVariantClick={this.onVariantClick}
      />
    );
  }
}

EditLearningResource.propTypes = {
  articleId: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  fetchArticle: PropTypes.func.isRequired,
  updateArticle: PropTypes.func.isRequired,
  article: ArticleShape,
  locale: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  setArticle: PropTypes.func.isRequired,
  articleLanguage: PropTypes.string.isRequired,
};

const mapDispatchToProps = {
  fetchArticle: actions.fetchArticle,
  updateArticle: actions.updateArticle,
  setArticle: actions.setArticle,
};

const makeMapStateToProps = (_, props) => {
  const { articleId } = props;
  const getArticleSelector = getArticle(articleId, true);
  return state => ({
    article: getArticleSelector(state),
  });
};

export default connect(makeMapStateToProps, mapDispatchToProps)(
  EditLearningResource,
);
