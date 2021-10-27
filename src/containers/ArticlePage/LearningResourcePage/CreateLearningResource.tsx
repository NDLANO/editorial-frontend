/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import { HelmetWithTracker } from '@ndla/tracker';
import { RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LearningResourceForm from './components/LearningResourceForm';
import { useFetchArticleData } from '../../FormikForm/formikDraftHooks';
import { toEditArticle } from '../../../util/routeHelpers';
import { UpdatedDraftApiType } from '../../../modules/draft/draftApiInterfaces';
import { License } from '../../../interfaces';
import { convertUpdateToNewDraft, transformArticleFromApiVersion } from '../../../util/articleUtil';

interface Props extends RouteComponentProps {
  licenses: License[];
}

const CreateLearningResource = ({ history, licenses }: Props) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
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
        licenses={licenses}
        translating={false}
        articleChanged={false}
        isNewlyCreated={false}
        translateToNN={() => {}}
      />
    </Fragment>
  );
};

export default CreateLearningResource;
