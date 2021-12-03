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
import { useFetchArticleData } from '../../FormikForm/formikDraftHooks';
import { useTranslateApi } from '../../FormikForm/translateFormHooks';
import Spinner from '../../../components/Spinner';
import { LocaleType } from '../../../interfaces';

interface Props {
  articleId: string;
  isNewlyCreated: boolean;
}

const EditTopicArticle = ({ articleId, isNewlyCreated }: Props) => {
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
    const redirectUrl = toEditArticle(article.id, article.articleType, article.language);
    return <Navigate replace to={redirectUrl} />;
  }
  return (
    <>
      <HelmetWithTracker title={`${article.title} ${t('htmlTitles.titleTemplate')}`} />
      <TopicArticleForm
        articleStatus={article.status}
        articleChanged={articleChanged}
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
