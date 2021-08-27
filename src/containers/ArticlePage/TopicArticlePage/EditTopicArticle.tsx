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
import { injectT, tType } from '@ndla/i18n';
import { RouteComponentProps } from 'react-router-dom';
import TopicArticleForm from './components/TopicArticleForm';
import { toEditArticle } from '../../../util/routeHelpers';
import { useFetchArticleData } from '../../FormikForm/formikDraftHooks';
import { useTranslateApi } from '../../FormikForm/translateFormHooks';
import Spinner from '../../../components/Spinner';
import { License, LocaleType } from '../../../interfaces';
import { NewReduxMessage, ReduxMessageError } from '../../Messages/messagesSelectors';

interface Props extends RouteComponentProps {
  articleId: string;
  selectedLanguage: LocaleType;
  isNewlyCreated: boolean;
  licenses: License[];
  applicationError: ActionFunction1<ReduxMessageError, Action<ReduxMessageError>>;
  createMessage: (message: NewReduxMessage) => Action<NewReduxMessage>;
  userAccess?: string;
}

const EditTopicArticle = ({
  articleId,
  selectedLanguage,
  t,
  isNewlyCreated,
  userAccess,
  createMessage,
  applicationError,
  licenses,
}: Props & tType) => {
  const {
    loading,
    article,
    setArticle,
    articleChanged,
    updateArticle,
    createArticle,
    updateArticleAndStatus,
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
        createMessage={createMessage}
        applicationError={applicationError}
        licenses={licenses}
        updateArticle={updateArticle}
        updateArticleAndStatus={updateArticleAndStatus}
      />
    </Fragment>
  );
};

// EditTopicArticle.propTypes = {
//   articleId: PropTypes.string.isRequired,
//   selectedLanguage: PropTypes.string.isRequired,
//   createMessage: PropTypes.func.isRequired,
//   isNewlyCreated: PropTypes.bool,
// };

export default withRouter(injectT(EditTopicArticle));
