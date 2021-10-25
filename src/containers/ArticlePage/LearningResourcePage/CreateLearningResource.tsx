/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment, useContext } from 'react';
import { HelmetWithTracker } from '@ndla/tracker';
import { RouteComponentProps } from 'react-router-dom';
import { Action, ActionFunction1 } from 'redux-actions';
import { useTranslation } from 'react-i18next';
import { LocaleContext } from '../../App/App';
import LearningResourceForm from './components/LearningResourceForm';
import { useFetchArticleData } from '../../FormikForm/formikDraftHooks';
import { toEditArticle } from '../../../util/routeHelpers';
import { UpdatedDraftApiType } from '../../../modules/draft/draftApiInterfaces';
import { NewReduxMessage, ReduxMessageError } from '../../Messages/messagesSelectors';
import { convertUpdateToNewDraft, transformArticleFromApiVersion } from '../../../util/articleUtil';

interface Props extends RouteComponentProps {
  applicationError: ActionFunction1<ReduxMessageError, Action<ReduxMessageError>>;
  createMessage: (message: NewReduxMessage) => Action<NewReduxMessage>;
  userAccess?: string;
}

const CreateLearningResource = ({
  history,
  applicationError,
  createMessage,
  userAccess,
}: Props) => {
  const locale = useContext(LocaleContext);
  const { t } = useTranslation();
  const { createArticle } = useFetchArticleData(undefined, locale);

  const createArticleAndPushRoute = async (createdArticle: UpdatedDraftApiType) => {
    const savedArticle = await createArticle(convertUpdateToNewDraft(createdArticle));
    history.push(toEditArticle(savedArticle.id, savedArticle.articleType, createdArticle.language));
    return await transformArticleFromApiVersion(savedArticle, locale);
  };

  return (
    <Fragment>
      <HelmetWithTracker title={t('htmlTitles.createLearningResourcePage')} />
      <LearningResourceForm
        article={{ language: locale, grepCodes: [] }}
        updateArticle={createArticleAndPushRoute}
        updateArticleAndStatus={inp => createArticleAndPushRoute(inp.updatedArticle)}
        createMessage={createMessage}
        applicationError={applicationError}
        userAccess={userAccess}
        translating={false}
        articleChanged={false}
        isNewlyCreated={false}
        translateToNN={() => {}}
      />
    </Fragment>
  );
};

export default CreateLearningResource;
