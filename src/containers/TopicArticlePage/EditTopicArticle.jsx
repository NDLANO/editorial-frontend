/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { HelmetWithTracker } from '@ndla/tracker';
import { injectT } from '@ndla/i18n';
import * as messageActions from '../Messages/messagesActions';
import { actions as draftActions, getDraft } from '../../modules/draft/draft';
import TopicArticleForm from './components/TopicArticleForm';
import { ArticleShape } from '../../shapes';
import { toEditArticle } from '../../util/routeHelpers';
import {
  actions as tagActions,
  getAllTagsByLanguage,
} from '../../modules/tag/tag';

class EditTopicArticle extends Component {
  constructor(props) {
    super(props);
    this.updateDraft = this.updateDraft.bind(this);
    this.createMessage = this.createMessage.bind(this);
  }

  componentDidMount() {
    const { articleId, fetchDraft, selectedLanguage } = this.props;
    fetchDraft({ id: articleId, language: selectedLanguage });
  }

  componentDidUpdate({
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

  updateDraft(article) {
    const { updateDraft } = this.props;
    updateDraft({ draft: article });
  }

  createMessage(message = {}) {
    const { addMessage } = this.props;
    addMessage(message);
  }

  render() {
    const { article, selectedLanguage, t, ...rest } = this.props;
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
    const language = selectedLanguage || article.language;
    return (
      <Fragment>
        <HelmetWithTracker
          title={`${article.title} ${t('htmlTitles.titleTemplate')}`}
        />
        <TopicArticleForm
<<<<<<< HEAD
=======
          initialModel={getInitialModel(article, language)}
>>>>>>> master
          selectedLanguage={article.language}
          revision={article.revision}
          articleStatus={article.status}
          onUpdate={this.updateDraft}
          article={{ ...article, language }}
          createMessage={this.createMessage}
          {...rest}
        />
      </Fragment>
    );
  }
}

EditTopicArticle.propTypes = {
  articleId: PropTypes.string.isRequired,
  fetchDraft: PropTypes.func.isRequired,
  fetchTags: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,
  article: ArticleShape,
  selectedLanguage: PropTypes.string.isRequired,
  addMessage: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  addMessage: messageActions.addMessage,
  fetchDraft: draftActions.fetchDraft,
  updateDraft: draftActions.updateDraft,
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

export default compose(
  injectT,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(EditTopicArticle);
