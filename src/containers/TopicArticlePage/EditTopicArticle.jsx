/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import { HelmetWithTracker } from '@ndla/tracker';
import { injectT } from '@ndla/i18n';
import TopicArticleForm from './components/TopicArticleForm';
import { toEditArticle } from '../../util/routeHelpers';
import { useFetchArticleData } from '../FormikForm/formikDraftHooks';

const EditTopicArticle = ({ articleId, selectedLanguage, t, ...rest }) => {
  const {
    article,
    tags,
    updateArticle,
    updateArticleAndStatus,
  } = useFetchArticleData(articleId, selectedLanguage);

  if (!article || !article.id) {
    return null;
  }

  if (article.articleType !== 'topic-article') {
    return (
      <Redirect
        to={toEditArticle(article.id, article.articleType, article.language)}
      />
    );
  }
  return (
    <Fragment>
      <HelmetWithTracker
        title={`${article.title} ${t('htmlTitles.titleTemplate')}`}
      />
      <TopicArticleForm
        articleStatus={article.status}
        onUpdate={updateArticle}
        updateArticleAndStatus={updateArticleAndStatus}
        tags={tags}
        article={article}
        {...rest}
      />
    </Fragment>
  );
};

EditTopicArticle.propTypes = {
  articleId: PropTypes.string.isRequired,
  selectedLanguage: PropTypes.string.isRequired,
  createMessage: PropTypes.func.isRequired,
};

export default injectT(withRouter(EditTopicArticle));
