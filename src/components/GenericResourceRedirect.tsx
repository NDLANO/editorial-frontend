/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Navigate, Outlet, useLocation, useParams } from "react-router";
import { UseQueryResult } from "@tanstack/react-query";
import { Spinner } from "@ndla/primitives";
import NotFound from "../containers/NotFoundPage/NotFoundPage";
import { isNotFoundError } from "../util/resolveJsonOrRejectWithError";
import { CreatingLanguageLocationState } from "../util/routeHelpers";

interface Props {
  queryResult: UseQueryResult<{ supportedLanguages: string[] }>;
}

export const GenericResourceRedirect = ({ queryResult }: Props) => {
  const location = useLocation();
  const { selectedLanguage } = useParams<"selectedLanguage">();

  if (queryResult.isLoading) return <Spinner />;

  if (queryResult.isError && isNotFoundError(queryResult.error)) {
    return <NotFound />;
  }

  // TODO: Implementing actual error handling
  if (queryResult.isError || !queryResult.data) {
    return <NotFound />;
  }

  if (
    !selectedLanguage ||
    (!queryResult.data.supportedLanguages.includes(selectedLanguage) &&
      !(location.state as CreatingLanguageLocationState)?.isCreatingLanguage)
  ) {
    return <Navigate replace state={{ from: location.pathname }} to={queryResult.data.supportedLanguages[0]} />;
  }

  return <Outlet context={queryResult.data} />;
};
