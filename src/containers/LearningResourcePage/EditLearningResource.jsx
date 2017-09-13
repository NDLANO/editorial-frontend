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
    const { locale, article, tags, isSaving, licenses } = this.props;
    if (!article) {
      return null;
    }

    if (article.articleType !== 'standard') {
      return <Redirect to={toEditArticle(article.id, article.articleType)} />;
    }

    return (
      <LearningResourceForm
        initialModel={getInitialModel(article)}
        revision={article.revision}
        tags={tags}
        licenses={licenses}
        locale={locale}
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
  EditLearningResource,
);
