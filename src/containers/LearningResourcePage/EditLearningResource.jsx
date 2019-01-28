/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Redirect, withRouter } from 'react-router-dom';

import * as messageActions from '../Messages/messagesActions';
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

class EditLearningResource extends PureComponent {
  constructor(props) {
    super(props);
    this.updateLearningResource = this.updateLearningResource.bind(this);
    this.createMessage = this.createMessage.bind(this);
  }

  componentDidMount() {
    const { articleId, fetchDraft, selectedLanguage } = this.props;
    fetchDraft({ id: articleId, language: selectedLanguage });
  }

  async componentDidUpdate({
    selectedLanguage: prevLanguage,
    articleId: prevArticleId,
    article: prevArticle,
  }) {
    const {
      articleId,
      fetchDraft,
      selectedLanguage,
      article,
      fetchTags,
    } = this.props;

    if (prevLanguage !== selectedLanguage || articleId !== prevArticleId) {
      fetchDraft({ id: articleId, language: selectedLanguage });
    }
    if (article && (!prevArticle || article.id !== prevArticle.id)) {
      fetchTags({ language: article.language });
    }
  }

  async updateLearningResource(article) {
    const { updateDraft } = this.props;
    updateDraft({ draft: article });
  }

  createMessage(message = {}) {
    const { addMessage } = this.props;
    addMessage(message);
  }

  render() {
    const { article, selectedLanguage, ...rest } = this.props;
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
    const language = article.supportedLanguages.includes(selectedLanguage)
      ? article.language
      : selectedLanguage;
    return (
      <Fragment>
        <Helmet title={`${article.title} - NDLA`} />
        <LearningResourceForm
          initialModel={getInitialModel(article, language)}
          selectedLanguage={selectedLanguage}
          revision={article.revision}
          articleStatus={article.status}
          onUpdate={this.updateLearningResource}
          createMessage={this.createMessage}
          article={article}
          {...rest}
        />
      </Fragment>
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
  addMessage: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  addMessage: messageActions.addMessage,
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
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(EditLearningResource),
);
