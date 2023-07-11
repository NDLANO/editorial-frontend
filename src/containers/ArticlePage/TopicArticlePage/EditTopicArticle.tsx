/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { Navigate, useParams } from 'react-router-dom';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import TopicArticleForm from './components/TopicArticleForm';
import { toEditArticle } from '../../../util/routeHelpers';
import Spinner from '../../../components/Spinner';
import { LocaleType } from '../../../interfaces';
import { useFetchArticleData } from '../../FormikForm/formikDraftHooks';
import NotFound from '../../NotFoundPage/NotFoundPage';
import { TranslateType, useTranslateToNN } from '../../../components/NynorskTranslateProvider';

interface Props {
  isNewlyCreated?: boolean;
}

const translateFields: TranslateType[] = [
  {
    field: 'title.title',
    type: 'text',
  },
  {
    field: 'metaDescription.metaDescription',
    type: 'text',
  },
  {
    field: 'introduction.introduction',
    type: 'text',
  },
  {
    field: 'content.content',
    type: 'html',
  },
  {
    field: 'tags.tags',
    type: 'text',
  },
];

const EditTopicArticle = ({ isNewlyCreated }: Props) => {
  const params = useParams<'id' | 'selectedLanguage'>();
  const articleId = Number(params.id!) || undefined;
  const selectedLanguage = params.selectedLanguage as LocaleType;
  const { t } = useTranslation();
  const { loading, article, taxonomy, setArticle, articleChanged, updateArticle } =
    useFetchArticleData(articleId, selectedLanguage);

  const { shouldTranslate, translate, translating } = useTranslateToNN();

  useEffect(() => {
    (async () => {
      if (article && !loading && shouldTranslate) {
        await translate(article, translateFields, setArticle);
      }
    })();
  }, [article, loading, setArticle, shouldTranslate, translate]);

  if (loading || translating || shouldTranslate) {
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
        isNewlyCreated={!!isNewlyCreated}
        updateArticle={updateArticle}
        supportedLanguages={article.supportedLanguages}
      />
    </>
  );
};

export default EditTopicArticle;
