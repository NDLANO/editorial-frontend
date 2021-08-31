/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { HelmetWithTracker } from '@ndla/tracker';
import { RouteComponentProps } from 'react-router-dom';
import { Action, ActionFunction1 } from 'redux-actions';
import LearningResourceForm from './components/LearningResourceForm';
import { toEditArticle } from '../../../util/routeHelpers';
import { useFetchArticleData } from '../../FormikForm/formikDraftHooks';
import { useTranslateApi } from '../../FormikForm/translateFormHooks';
import Spinner from '../../../components/Spinner';
import { License, LocaleType } from '../../../interfaces';
import { NewReduxMessage, ReduxMessageError } from '../../Messages/messagesSelectors';

interface Props extends RouteComponentProps {
  isNewlyCreated: boolean;
  articleId: string;
  selectedLanguage: LocaleType;
  licenses: License[];
  applicationError: ActionFunction1<ReduxMessageError, Action<ReduxMessageError>>;
  createMessage: (message: NewReduxMessage) => Action<NewReduxMessage>;
}

const EditLearningResource = ({
  selectedLanguage,
  articleId,
  t,
  isNewlyCreated,
  licenses,
  applicationError,
  createMessage,
}: Props) => {
  const { t } = useTranslation();
  const {
    loading,
    article,
    setArticle,
    articleChanged,
    updateArticle,
    updateArticleAndStatus,
    createArticle,
  } = useFetchArticleData(articleId, selectedLanguage);
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
  if (article.articleType !== 'standard') {
    return <Redirect to={toEditArticle(article.id, article.articleType, article.language)} />;
  }

  return (
    <Fragment>
      <HelmetWithTracker title={`${article.title} ${t('htmlTitles.titleTemplate')}`} />
      <LearningResourceForm
        article={article}
        articleStatus={article.status}
        articleChanged={articleChanged}
        translating={translating}
        translateToNN={translateToNN}
        isNewlyCreated={isNewlyCreated}
        licenses={licenses}
        updateArticle={updateArticle}
        updateArticleAndStatus={updateArticleAndStatus}
        applicationError={applicationError}
        createMessage={createMessage}
      />
    </Fragment>
  );
};

export default withRouter(injectT(EditLearningResource));
