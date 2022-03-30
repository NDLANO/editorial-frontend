/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { HelmetWithTracker } from '@ndla/tracker';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IUpdatedArticle } from '@ndla/types-draft-api';
import LearningResourceForm from './components/LearningResourceForm';
import { useFetchArticleData } from '../../FormikForm/formikDraftHooks';
import { toEditArticle } from '../../../util/routeHelpers';
import { convertUpdateToNewDraft } from '../../../util/articleUtil';

const CreateLearningResource = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = i18n.language;
  const { createArticle } = useFetchArticleData(undefined, locale);

  const createArticleAndPushRoute = async (createdArticle: IUpdatedArticle) => {
    const savedArticle = await createArticle(convertUpdateToNewDraft(createdArticle));
    navigate(toEditArticle(savedArticle.id, savedArticle.articleType, createdArticle.language));
    return savedArticle;
  };

  return (
    <>
      <HelmetWithTracker title={t('htmlTitles.createLearningResourcePage')} />
      <LearningResourceForm
        updateArticle={createArticleAndPushRoute}
        updateArticleAndStatus={inp => createArticleAndPushRoute(inp.updatedArticle)}
        translating={false}
        articleChanged={false}
        isNewlyCreated={false}
        articleLanguage={i18n.language}
      />
    </>
  );
};

export default CreateLearningResource;
