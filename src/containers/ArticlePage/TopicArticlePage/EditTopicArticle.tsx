/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Action, ActionFunction1 } from 'redux-actions';
import { HelmetWithTracker } from '@ndla/tracker';
import { RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TopicArticleForm from './components/TopicArticleForm';
import { toEditArticle } from '../../../util/routeHelpers';
import { useFetchArticleData } from '../../FormikForm/formikDraftHooks';
import { useTranslateApi } from '../../FormikForm/translateFormHooks';
import Spinner from '../../../components/Spinner';
import { LocaleType } from '../../../interfaces';
import { NewReduxMessage, ReduxMessageError } from '../../Messages/messagesSelectors';

interface Props extends RouteComponentProps {
  articleId: string;
  selectedLanguage: LocaleType;
  isNewlyCreated: boolean;
  applicationError: ActionFunction1<ReduxMessageError, Action<ReduxMessageError>>;
  createMessage: (message: NewReduxMessage) => Action<NewReduxMessage>;
}

const EditTopicArticle = ({
  articleId,
  selectedLanguage,
  isNewlyCreated,
  createMessage,
  applicationError,
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
        createMessage={createMessage}
        applicationError={applicationError}
        updateArticle={updateArticle}
        updateArticleAndStatus={updateArticleAndStatus}
      />
    </Fragment>
  );
};

export default withRouter(EditTopicArticle);
