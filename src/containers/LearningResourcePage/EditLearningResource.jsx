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

import { actions, getDraft } from '../../modules/draft/draft';
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
    this.updateDraft = this.updateDraft.bind(this);
  }

  componentWillMount() {
    const { articleId, fetchDraft, selectedLanguage } = this.props;
    fetchDraft({ id: articleId, language: selectedLanguage });
  }

  componentWillReceiveProps(nextProps) {
    const {
      articleId,
      fetchDraft,
      selectedLanguage,
      article,
      fetchTags,
    } = nextProps;
    if (
      this.props.selectedLanguage !== selectedLanguage ||
      articleId !== this.props.articleId
    ) {
      fetchDraft({ id: articleId, language: selectedLanguage });
    }
    if (
      article &&
      (!this.props.article || article.id !== this.props.article.id)
    ) {
      fetchTags({ language: article.language });
    }
  }

  updateDraft(article) {
    const { updateDraft } = this.props;
    updateDraft({ draft: article });
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
  selectedLanguage: PropTypes.string.isRequired,
  fetchTags: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  fetchDraft: actions.fetchDraft,
  updateDraft: actions.updateDraft,
  setDraft: actions.setDraft,
  fetchTags: tagActions.fetchTags,
};

const mapStateToProps = (state, props) => {
  const { articleId } = props;
  const getArticleSelector = getDraft(articleId, true);
  const article = getArticleSelector(state);
  const getAllTagsSelector = getAllTagsByLanguage(
    article ? article.language : '',
  );
  return {
    article,
    tags: getAllTagsSelector(state),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditLearningResource),
);
