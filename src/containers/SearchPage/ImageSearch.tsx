/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { useSearchImages } from "../../modules/image/imageQueries";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { parseSearchParams } from "./components/form/SearchForm";
import SearchImageForm from "./components/form/SearchImageForm";
import { GenericSearchList } from "./components/GenericSearchList";
import SearchImage from "./components/results/SearchImage";
import SearchListOptions from "./components/results/SearchListOptions";
import { SearchPageContainer } from "./components/SearchPageContainer";
import SearchSort from "./components/sort/SearchSort";
import { useStableSearchPageParams } from "./useStableSearchPageParams";
import Pagination from "../../components/abstractions/Pagination";
import { useUserData } from "../../modules/draft/draftQueries";
import { getAccessToken, isActiveToken } from "../../util/authHelpers";

export const Component = () => <PrivateRoute component={<ImageSearch />} />;

export const ImageSearch = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [params, setParams] = useStableSearchPageParams();

  const userDataQuery = useUserData({
    enabled: isActiveToken(getAccessToken()),
  });

  const parsedParams = useMemo(() => {
    const parsed = parseSearchParams(location.search, true);
    return { ...parsed, includeCopyrighted: true };
  }, [location.search]);

  const searchQuery = useSearchImages(parsedParams);
  useSearchImages({ ...parsedParams, page: parsedParams.page ? parsedParams.page + 1 : 2 }); // preload next page.

  return (
    <SearchPageContainer asChild consumeCss>
      <main>
        <title>{t("htmlTitles.search.image")}</title>
        <SearchImageForm userData={userDataQuery.data} />
        <SearchSort type="image" />
        <SearchListOptions totalCount={searchQuery.data?.totalCount} />
        <GenericSearchList
          type="image"
          loading={searchQuery.isLoading}
          error={searchQuery.error}
          resultLength={searchQuery.data?.totalCount ?? 0}
        >
          {searchQuery.data?.results.map((image) => (
            <SearchImage image={image} key={image.id} />
          ))}
        </GenericSearchList>
        <Pagination
          page={Number(params.get("page")) || 1}
          onPageChange={(details) => setParams({ page: details.page.toString() })}
          pageSize={searchQuery.data?.pageSize}
          count={searchQuery.data?.totalCount ?? 0}
          siblingCount={1}
        />
      </main>
    </SearchPageContainer>
  );
};
