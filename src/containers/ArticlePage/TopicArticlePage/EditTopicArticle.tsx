/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { HelmetWithTracker } from '@ndla/tracker';
import { RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TopicArticleForm from './components/TopicArticleForm';
import { toEditArticle } from '../../../util/routeHelpers';
import { useFetchArticleData } from '../../FormikForm/formikDraftHooks';
import { useTranslateApi } from '../../FormikForm/translateFormHooks';
import Spinner from '../../../components/Spinner';
import { License, LocaleType } from '../../../interfaces';

interface Props extends RouteComponentProps {
  articleId: string;
  selectedLanguage: LocaleType;
  isNewlyCreated: boolean;
  licenses: License[];
  userAccess: string | undefined;
}

const EditTopicArticle = ({
  articleId,
  selectedLanguage,
  isNewlyCreated,
  userAccess,
  licenses,
}: Props) => {
  const {
    loading,
    article,
    setArticle,
    articleChanged,
    updateArticle,
    updateArticleAndStatus,
  } = useFetchArticleData(articleId, selectedLanguage);
  const { t } = useTranslation();
  const { translating, translateToNN } = useTranslateApi(article, setArticle, [
    'id',
    'title',
    'metaDescription',
    'introduction',
    'content',
  ]);

  if (loading || !article || !article.id) {
    return <Spinner withWrapper />;
  }

  if (article.articleType !== 'topic-article') {
    return <Redirect to={toEditArticle(article.id, article.articleType, article.language)} />;
  }
  return (
    <Fragment>
      <HelmetWithTracker title={`${article.title} ${t('htmlTitles.titleTemplate')}`} />
      <TopicArticleForm
        articleStatus={article.status}
        articleChanged={articleChanged}
        article={article}
        translateToNN={translateToNN}
        translating={translating}
        isNewlyCreated={isNewlyCreated}
        userAccess={userAccess}
        licenses={licenses}
        updateArticle={updateArticle}
        updateArticleAndStatus={updateArticleAndStatus}
      />
    </Fragment>
  );
};

export default withRouter(EditTopicArticle);
