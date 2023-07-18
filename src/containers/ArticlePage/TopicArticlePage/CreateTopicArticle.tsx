/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { HelmetWithTracker } from '@ndla/tracker';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IUpdatedArticle, IArticle } from '@ndla/types-backend/draft-api';
import TopicArticleForm from './components/TopicArticleForm';
import { useFetchArticleData } from '../../FormikForm/formikDraftHooks';
import { toEditArticle } from '../../../util/routeHelpers';
import { convertUpdateToNewDraft } from '../../../util/articleUtil';

const CreateTopicArticle = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = i18n.language;
  const { createArticle } = useFetchArticleData(undefined, locale);

  const createArticleAndPushRoute = async (createdArticle: IUpdatedArticle): Promise<IArticle> => {
    const savedArticle = await createArticle(convertUpdateToNewDraft(createdArticle));
    navigate(toEditArticle(savedArticle.id, savedArticle.articleType, createdArticle.language));
    return savedArticle;
  };

  return (
    <>
      <HelmetWithTracker title={t('htmlTitles.createTopicArticlePage')} />
      <TopicArticleForm
        articleLanguage={i18n.language}
        updateArticle={createArticleAndPushRoute}
        isNewlyCreated={false}
        articleChanged={false}
        supportedLanguages={[i18n.language]}
      />
    </>
  );
};

export default CreateTopicArticle;
