/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { Route, useParams, Routes, useLocation, Navigate } from 'react-router-dom';
import { Spinner } from '@ndla/editor';
import EditLearningResource from './EditLearningResource';
import { useDraft } from '../../../modules/draft/draftQueries';
import NotFound from '../../NotFoundPage/NotFoundPage';

interface Props {
  isNewlyCreated: boolean;
}

const EditResourceRedirect = ({ isNewlyCreated }: Props) => {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const { pathname } = useLocation();
  const params = useParams<'articleId'>();
  const articleId = params.articleId!;
  const { data } = useDraft(articleId, undefined, { enabled: !!articleId });

  if (!data) return <Spinner />;
  const supportedLanguage =
    data.supportedLanguages.find(l => l === locale) ?? data.supportedLanguages[0];

  return (
    <Routes>
      <Route
        path=":selectedLanguage/"
        element={<EditLearningResource articleId={articleId} isNewlyCreated={isNewlyCreated} />}
      />
      <Route
        path="/"
        element={<Navigate replace state={{ from: pathname }} to={supportedLanguage} />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default EditResourceRedirect;
