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
import { useTranslateForm } from '../FormikForm/translateFormHooks';
import Spinner from '../../components/Spinner';

const EditTopicArticle = ({
  articleId,
  selectedLanguage,
  t,
  isNewlyCreated,
  ...rest
}) => {
  const { loading, article, setArticle, ...articleHooks } = useFetchArticleData(
    articleId,
    selectedLanguage,
  );
  const { translating, translateArticle } = useTranslateForm(
    article,
    setArticle,
  );

  if (loading || translating || !article || !article.id) {
    return <Spinner withWrapper />;
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
        article={article}
        translateArticle={translateArticle}
        isNewlyCreated={isNewlyCreated}
        {...rest}
        {...articleHooks}
      />
    </Fragment>
  );
};

EditTopicArticle.propTypes = {
  articleId: PropTypes.string.isRequired,
  selectedLanguage: PropTypes.string.isRequired,
  createMessage: PropTypes.func.isRequired,
  isNewlyCreated: PropTypes.bool,
};

export default injectT(withRouter(EditTopicArticle));
