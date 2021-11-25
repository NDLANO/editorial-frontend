/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Navigate, Route, Routes, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Spinner } from '@ndla/editor';
import EditTopicArticle from './EditTopicArticle';
import { useDraft } from '../../../modules/draft/draftQueries';

interface Props {
  isNewlyCreated: boolean;
}

const EditArticleRedirect = ({ isNewlyCreated }: Props) => {
  const { articleId } = useParams<'articleId'>();
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const locale = i18n.language;
  const { data } = useDraft(articleId!, undefined, { enabled: !!articleId });

  if (!data) {
    return <Spinner />;
  }

  if (articleId === undefined) {
    return <Navigate to={'/404'} />;
  }

  const supportedLanguage =
    data.supportedLanguages.find(l => l === locale) ?? data.supportedLanguages[0];

  return (
    <Routes>
      <Route
        path={':selectedLanguage/'}
        element={<EditTopicArticle articleId={articleId} isNewlyCreated={isNewlyCreated} />}
      />
      <Route
        path="/"
        element={<Navigate replace state={{ from: pathname }} to={supportedLanguage} />}
      />
    </Routes>
  );
};

export default EditArticleRedirect;
