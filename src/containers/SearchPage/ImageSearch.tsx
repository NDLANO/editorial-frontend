/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SearchParamsDTO } from "@ndla/types-backend/image-api";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../components/abstractions/Pagination";
import config from "../../config";
import { useUserData } from "../../modules/draft/draftQueries";
import { useSearchImages } from "../../modules/image/imageQueries";
import { getAccessToken, isActiveToken } from "../../util/authHelpers";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import SearchImageForm from "./components/form/SearchImageForm";
import { GenericSearchList } from "./components/GenericSearchList";
import SearchImage from "./components/results/SearchImage";
import SearchListOptions from "./components/results/SearchListOptions";
import { SearchPageContainer } from "./components/SearchPageContainer";
import SearchSort, { SortType } from "./components/sort/SearchSort";
import { useStableSearchPageParams } from "./useStableSearchPageParams";

export const Component = () => <PrivateRoute component={<ImageSearch />} />;

const DEFAULT_PARAMS: SearchParamsDTO = {
  fallback: false,
  license: config.licenseAll,
  page: 1,
  pageSize: 10,
  sort: "-relevance",
};

export const ImageSearch = () => {
  const { t } = useTranslation();
  const [params, setParams] = useStableSearchPageParams();

  const userDataQuery = useUserData({
    enabled: isActiveToken(getAccessToken()),
  });

  const parsedParams: SearchParamsDTO = useMemo(() => {
    const parsed: SearchParamsDTO = {
      fallback: DEFAULT_PARAMS.fallback,
      query: params.get("query") ?? undefined,
      language: params.get("language") ?? undefined,
      license: params.get("license") ?? DEFAULT_PARAMS.license,
      inactive: params.get("inactive") ? params.get("inactive") === "true" : undefined,
      modelReleased: params.get("model-released")?.split(",") ?? undefined,
      page: Number(params.get("page")),
      sort: (params.get("sort") ?? DEFAULT_PARAMS.sort) as SearchParamsDTO["sort"],
      pageSize: Number(params.get("page-size")) || DEFAULT_PARAMS.pageSize,
      users: params.get("users")?.split(",") ?? undefined,
      widthFrom: Number(params.get("width-from")) || undefined,
      widthTo: Number(params.get("width-to")) || undefined,
      heightFrom: Number(params.get("height-from")) || undefined,
      heightTo: Number(params.get("height-to")) || undefined,
    };
    return parsed;
  }, [params]);

  const searchQuery = useSearchImages(parsedParams);
  useSearchImages({ ...parsedParams, page: parsedParams.page ? parsedParams.page + 1 : 2 }); // preload next page.

  const SORT_TYPES: SortType[] = ["id", "relevance", "title", "lastUpdated", "width"];

  return (
    <SearchPageContainer asChild consumeCss>
      <main>
        <title>{t("htmlTitles.search.image")}</title>
        <SearchImageForm userData={userDataQuery.data} />
        <SearchSort
          sortTypes={SORT_TYPES}
          value={params.get("sort") ?? DEFAULT_PARAMS.sort!}
          onValueChange={(value) => setParams({ sort: value === DEFAULT_PARAMS.sort ? null : value })}
        />
        <SearchListOptions totalCount={searchQuery.data?.totalCount} defaultValue={DEFAULT_PARAMS.pageSize!} />
        <GenericSearchList
          type="image"
          loading={searchQuery.isLoading}
          error={searchQuery.error}
          query={params.get("query")}
          resultLength={searchQuery.data?.totalCount ?? 0}
        >
          {searchQuery.data?.results.map((image) => (
            <SearchImage image={image} key={image.id} />
          ))}
        </GenericSearchList>
        <Pagination
          page={Number(params.get("page")) || DEFAULT_PARAMS.page}
          onPageChange={(details) =>
            setParams({ page: details.page === DEFAULT_PARAMS.page ? null : details.page.toString() })
          }
          pageSize={searchQuery.data?.pageSize}
          count={searchQuery.data?.totalCount ?? 0}
          siblingCount={1}
        />
      </main>
    </SearchPageContainer>
  );
};
