/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Spinner } from "@ndla/primitives";
import { Navigate, useParams } from "react-router";
import { useDraft } from "../../modules/draft/draftQueries";
import { toEditArticle } from "../../util/routeHelpers";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

export const Component = () => <PrivateRoute component={<GenericArticleRedirect />} />;

export const GenericArticleRedirect = () => {
  const { id } = useParams<"id">();
  const parsedId = Number(id);
  const { data: article, error, isLoading } = useDraft({ id: parsedId }, { enabled: !!parsedId });
  if (isLoading) return <Spinner />;
  if (error || !article || !parsedId) return <NotFoundPage />;

  const replaceUrl = toEditArticle(article.id, article.articleType);
  return <Navigate replace to={replaceUrl} />;
};
