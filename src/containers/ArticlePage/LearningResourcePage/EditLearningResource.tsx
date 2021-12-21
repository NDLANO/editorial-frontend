/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HelmetWithTracker } from '@ndla/tracker';
import { Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LearningResourceForm from './components/LearningResourceForm';
import { toEditArticle } from '../../../util/routeHelpers';
import { useFetchArticleData } from '../../FormikForm/formikDraftHooks';
import { useTranslateApi } from '../../FormikForm/translateFormHooks';
import Spinner from '../../../components/Spinner';
import { LocaleType } from '../../../interfaces';

interface Props {
  isNewlyCreated: boolean;
  articleId: string;
}

const EditLearningResource = ({ articleId, isNewlyCreated }: Props) => {
  const { t } = useTranslation();
  const params = useParams<'selectedLanguage'>();
  const selectedLanguage = params.selectedLanguage as LocaleType;
  const {
    loading,
    article,
    setArticle,
    articleChanged,
    updateArticle,
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
  if (article.articleType !== 'standard') {
    const replaceUrl = toEditArticle(article.id, article.articleType, selectedLanguage);
    return <Navigate replace to={replaceUrl} />;
  }

  return (
    <>
      <HelmetWithTracker title={`${article.title?.title} ${t('htmlTitles.titleTemplate')}`} />
      <LearningResourceForm
        articleLanguage={selectedLanguage}
        article={article}
        articleStatus={article.status}
        articleChanged={articleChanged}
        translating={translating}
        translateToNN={translateToNN}
        isNewlyCreated={isNewlyCreated}
        updateArticle={updateArticle}
        updateArticleAndStatus={updateArticleAndStatus}
      />
    </>
  );
};

export default EditLearningResource;
