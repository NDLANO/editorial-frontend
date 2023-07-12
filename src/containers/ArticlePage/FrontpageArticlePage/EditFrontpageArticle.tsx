/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HelmetWithTracker } from '@ndla/tracker';
import { Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import FrontpageArticleForm from './components/FrontpageArticleForm';
import { toEditArticle } from '../../../util/routeHelpers';
import { useFetchArticleData } from '../../FormikForm/formikDraftHooks';
import Spinner from '../../../components/Spinner';
import { LocaleType } from '../../../interfaces';
import NotFound from '../../NotFoundPage/NotFoundPage';
import { TranslateType, useTranslateToNN } from '../../../components/NynorskTranslateProvider';
import {
  articleIsFrontpageArticle,
  useFrontpageArticle,
} from '../../../components/FrontpageArticleProvider';

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
interface Props {
  isNewlyCreated?: boolean;
}

const EditFrontpageArticle = ({ isNewlyCreated }: Props) => {
  const { t } = useTranslation();
  const params = useParams<'selectedLanguage' | 'id'>();
  const selectedLanguage = params.selectedLanguage as LocaleType;
  const articleId = Number(params.id!) || undefined;
  const { loading, article, setArticle, articleChanged, updateArticle } = useFetchArticleData(
    articleId,
    selectedLanguage,
  );
  const { translate, shouldTranslate, translating } = useTranslateToNN();
  const { setFrontpageArticle } = useFrontpageArticle();

  useEffect(() => {
    (async () => {
      if (article && !loading && shouldTranslate) {
        await translate(article, translateFields, setArticle);
      }
    })();
  }, [article, loading, setArticle, shouldTranslate, translate]);

  if (loading || translating) {
    return <Spinner withWrapper />;
  }

  if (!article) {
    return <NotFound />;
  }

  if (article.articleType !== 'frontpage-article') {
    const replaceUrl = toEditArticle(article.id, article.articleType, selectedLanguage);
    return <Navigate replace to={replaceUrl} />;
  }
  const newLanguage = !article.supportedLanguages.includes(selectedLanguage);

  if (articleIsFrontpageArticle(article.id)) {
    setFrontpageArticle(true);
  }

  return (
    <>
      <HelmetWithTracker title={`${article.title?.title} ${t('htmlTitles.titleTemplate')}`} />
      <FrontpageArticleForm
        articleLanguage={selectedLanguage}
        article={article}
        articleStatus={article.status}
        articleChanged={articleChanged || newLanguage}
        isNewlyCreated={!!isNewlyCreated}
        updateArticle={updateArticle}
        supportedLanguages={article.supportedLanguages}
      />
    </>
  );
};

export default EditFrontpageArticle;
