/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

import { actions, getArticle } from '../../modules/article/article';
import LearningResourceForm, {
  getInitialModel,
} from './components/LearningResourceForm';
import { ArticleShape } from '../../shapes';
import { toEditArticle } from '../../util/routeHelpers';
import {
  actions as tagActions,
  getAllTagsByLanguage,
} from '../../modules/tag/tag';

class EditLearningResource extends Component {
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
        initialModel={getInitialModel(article)}
        revision={article.revision}
        tags={tags}
        licenses={licenses}
        isSaving={isSaving}
        onUpdate={this.updateArticle}
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
  fetchTags: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  fetchArticle: actions.fetchArticle,
  updateArticle: actions.updateArticle,
  setArticle: actions.setArticle,
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditLearningResource),
);
