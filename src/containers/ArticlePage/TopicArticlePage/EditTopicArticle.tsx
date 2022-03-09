/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { Navigate, useParams } from 'react-router-dom';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import TopicArticleForm from './components/TopicArticleForm';
import { toEditArticle } from '../../../util/routeHelpers';
import { useTranslateApi } from '../../FormikForm/translateFormHooks';
import Spinner from '../../../components/Spinner';
import { LocaleType } from '../../../interfaces';
import { useFetchArticleData } from '../../FormikForm/formikDraftHooks';
import NotFound from '../../NotFoundPage/NotFoundPage';

interface Props {
  isNewlyCreated: boolean;
}

const EditTopicArticle = ({ isNewlyCreated }: Props) => {
  const params = useParams<'id' | 'selectedLanguage'>();
  const articleId = Number(params.id!) ?? undefined;
  const selectedLanguage = params.selectedLanguage as LocaleType;
  const {
    loading,
    article,
    taxonomy,
    setArticle,
    articleChanged,
    updateArticle,
    updateArticleAndStatus,
  } = useFetchArticleData(articleId, selectedLanguage);
  const { t } = useTranslation();
  const { translating, translateToNN } = useTranslateApi(article, setArticle, [
    'id',
    'title.title',
    'metaDescription.metaDescription',
    'introduction.introduction',
    'content.content',
  ]);

  if (loading || !article || !article.id) {
    return <Spinner withWrapper />;
  }

  if (!article || !articleId) {
    return <NotFound />;
  }

  if (article.articleType !== 'topic-article') {
    const redirectUrl = toEditArticle(article.id, article.articleType, article.title?.language);
    return <Navigate replace to={redirectUrl} />;
  }
  const newLanguage = !article.supportedLanguages.includes(selectedLanguage);
  return (
    <>
      <HelmetWithTracker title={`${article.title?.title} ${t('htmlTitles.titleTemplate')}`} />
      <TopicArticleForm
        articleTaxonomy={taxonomy}
        articleStatus={article.status}
        articleLanguage={selectedLanguage}
        articleChanged={articleChanged || newLanguage}
        article={article}
        translateToNN={translateToNN}
        translating={translating}
        isNewlyCreated={isNewlyCreated}
        updateArticle={updateArticle}
        updateArticleAndStatus={updateArticleAndStatus}
      />
    </>
  );
};

export default EditTopicArticle;
