/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useContext, Fragment } from 'react';
import { HelmetWithTracker } from '@ndla/tracker';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Action, ActionFunction1 } from 'redux-actions';
import { useTranslation } from 'react-i18next';
import { LocaleContext } from '../../App/App';
import TopicArticleForm from './components/TopicArticleForm';
import { useFetchArticleData } from '../../FormikForm/formikDraftHooks';
import { toEditArticle } from '../../../util/routeHelpers';
import { UpdatedDraftApiType } from '../../../modules/draft/draftApiInterfaces';
import { ConvertedDraftType, License } from '../../../interfaces';
import { convertUpdateToNewDraft, transformArticleFromApiVersion } from '../../../util/articleUtil';
import { NewReduxMessage, ReduxMessageError } from '../../Messages/messagesSelectors';

interface Props extends RouteComponentProps {
  licenses: License[];
  userAccess?: string;
  applicationError: ActionFunction1<ReduxMessageError, Action<ReduxMessageError>>;
  createMessage: (message: NewReduxMessage) => Action<NewReduxMessage>;
}

const CreateTopicArticle = ({
  history,
  licenses,
  userAccess,
  applicationError,
  createMessage,
}: Props) => {
  const { t } = useTranslation();
  const locale = useContext(LocaleContext);
  const { createArticle } = useFetchArticleData(undefined, locale);

  const createArticleAndPushRoute = async (
    createdArticle: UpdatedDraftApiType,
  ): Promise<ConvertedDraftType> => {
    const savedArticle = await createArticle(convertUpdateToNewDraft(createdArticle));
    history.push(toEditArticle(savedArticle.id, savedArticle.articleType, createdArticle.language));
    return await transformArticleFromApiVersion(savedArticle, locale);
  };

  return (
    <Fragment>
      <HelmetWithTracker title={t('htmlTitles.createTopicArticlePage')} />
      <TopicArticleForm
        article={{ language: locale, grepCodes: [] }}
        updateArticle={createArticleAndPushRoute}
        isNewlyCreated={false}
        licenses={licenses}
        userAccess={userAccess}
        translating={false}
        applicationError={applicationError}
        createMessage={createMessage}
        articleChanged={false}
        translateToNN={() => {}}
      />
    </Fragment>
  );
};

export default withRouter(CreateTopicArticle);
