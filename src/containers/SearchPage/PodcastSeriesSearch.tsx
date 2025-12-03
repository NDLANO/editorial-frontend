/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { parseSearchParams } from "./components/form/SearchForm";
import SearchPodcastSeriesForm from "./components/form/SearchPodcastSeriesForm";
import { GenericSearchList } from "./components/GenericSearchList";
import SearchListOptions from "./components/results/SearchListOptions";
import { SearchPageContainer } from "./components/SearchPageContainer";
import { useUserData } from "../../modules/draft/draftQueries";
import { getAccessToken, isActiveToken } from "../../util/authHelpers";
import SearchPodcastSeries from "./components/results/SearchPodcastSeries";
import SearchSort from "./components/sort/SearchSort";
import { useStableSearchPageParams } from "./useStableSearchPageParams";
import Pagination from "../../components/abstractions/Pagination";
import { useSearchSeries } from "../../modules/audio/audioQueries";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

export const Component = () => <PrivateRoute component={<PodcastSeriesSearch />} />;

export const PodcastSeriesSearch = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [params, setParams] = useStableSearchPageParams();
  const parsedParams = parseSearchParams(location.search, true);

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
        <SearchSort type="podcast-series" />
        <SearchListOptions totalCount={searchQuery.data?.totalCount} />
        <GenericSearchList
          type="podcast-series"
          loading={searchQuery.isLoading}
          error={searchQuery.error}
          resultLength={searchQuery.data?.totalCount ?? 0}
        >
          {searchQuery.data?.results.map((series) => (
            <SearchPodcastSeries series={series} key={series.id} />
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
