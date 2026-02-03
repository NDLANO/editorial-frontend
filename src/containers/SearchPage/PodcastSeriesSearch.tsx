/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SearchParamsDTO } from "@ndla/types-backend/audio-api";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../components/abstractions/Pagination";
import config from "../../config";
import { useSearchSeries } from "../../modules/audio/audioQueries";
import { useUserData } from "../../modules/draft/draftQueries";
import { getAccessToken, isActiveToken } from "../../util/authHelpers";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import SearchPodcastSeriesForm from "./components/form/SearchPodcastSeriesForm";
import { GenericSearchList } from "./components/GenericSearchList";
import SearchListOptions from "./components/results/SearchListOptions";
import SearchPodcastSeries from "./components/results/SearchPodcastSeries";
import { SearchPageContainer } from "./components/SearchPageContainer";
import SearchSort from "./components/sort/SearchSort";
import { useStableSearchPageParams } from "./useStableSearchPageParams";

export const Component = () => <PrivateRoute component={<PodcastSeriesSearch />} />;

const DEFAULT_PARAMS: SearchParamsDTO = {
  fallback: false,
  license: config.licenseAll,
  page: 1,
  pageSize: 10,
  sort: "-relevance",
};

export const PodcastSeriesSearch = () => {
  const { t } = useTranslation();
  const [params, setParams] = useStableSearchPageParams();

  const parsedParams = useMemo(() => {
    const parsed: SearchParamsDTO = {
      fallback: DEFAULT_PARAMS.fallback,
      license: DEFAULT_PARAMS.license,
      page: Number(params.get("page")) || DEFAULT_PARAMS.page,
      pageSize: Number(params.get("page-size")) || DEFAULT_PARAMS.pageSize,
      sort: (params.get("sort") ?? DEFAULT_PARAMS.sort) as SearchParamsDTO["sort"],
      query: params.get("query") ?? undefined,
      language: params.get("language") ?? undefined,
    };
    return parsed;
  }, [params]);

  const userDataQuery = useUserData({
    enabled: isActiveToken(getAccessToken()),
  });

  const searchQuery = useSearchSeries(parsedParams);
  useSearchSeries({ ...parsedParams, page: parsedParams.page ? parsedParams.page + 1 : 2 }); // preload next page.

  return (
    <SearchPageContainer asChild consumeCss>
      <main>
        <title>{t("htmlTitles.search.podcast-series")}</title>
        <SearchPodcastSeriesForm userData={userDataQuery.data} />
        <SearchSort
          value={params.get("sort") ?? DEFAULT_PARAMS.sort!}
          onValueChange={(value) => setParams({ sort: value === DEFAULT_PARAMS.sort ? null : value })}
        />
        <SearchListOptions totalCount={searchQuery.data?.totalCount} defaultValue={DEFAULT_PARAMS.pageSize!} />
        <GenericSearchList
          type="podcast-series"
          loading={searchQuery.isLoading}
          error={searchQuery.error}
          query={params.get("query")}
          resultLength={searchQuery.data?.totalCount ?? 0}
        >
          {searchQuery.data?.results.map((series) => (
            <SearchPodcastSeries series={series} key={series.id} />
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
