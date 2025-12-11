/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SearchParamsDTO } from "@ndla/types-backend/audio-api";
import SearchAudioForm from "./components/form/SearchAudioForm";
import { GenericSearchList } from "./components/GenericSearchList";
import SearchAudio from "./components/results/SearchAudio";
import { useSearchAudio } from "../../modules/audio/audioQueries";
import { useUserData } from "../../modules/draft/draftQueries";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { SearchPageContainer } from "./components/SearchPageContainer";
import { getAccessToken, isActiveToken } from "../../util/authHelpers";
import SearchListOptions from "./components/results/SearchListOptions";
import SearchSort from "./components/sort/SearchSort";
import { useStableSearchPageParams } from "./useStableSearchPageParams";
import Pagination from "../../components/abstractions/Pagination";
import config from "../../config";

export const Component = () => <PrivateRoute component={<AudioSearch />} />;

const DEFAULT_PARAMS: SearchParamsDTO = {
  fallback: false,
  page: 1,
  pageSize: 10,
  sort: "-relevance",
  license: config.licenseAll,
};

export const AudioSearch = () => {
  const { t } = useTranslation();
  const [params, setParams] = useStableSearchPageParams();

  const userDataQuery = useUserData({
    enabled: isActiveToken(getAccessToken()),
  });

  const parsedParams: SearchParamsDTO = useMemo(() => {
    const parsed: SearchParamsDTO = {
      fallback: DEFAULT_PARAMS.fallback,
      audioType: params.get("audio-type") ?? undefined,
      page: Number(params.get("page")) || DEFAULT_PARAMS.page,
      pageSize: Number(params.get("page-size")) || DEFAULT_PARAMS.pageSize,
      query: params.get("query") ?? undefined,
      language: params.get("language") ?? undefined,
      sort: (params.get("sort") ?? DEFAULT_PARAMS.sort) as SearchParamsDTO["sort"],
      license: params.get("license") ?? DEFAULT_PARAMS.license,
    };
    return parsed;
  }, [params]);

  const searchQuery = useSearchAudio(parsedParams);
  useSearchAudio({ ...parsedParams, page: parsedParams.page ? parsedParams.page + 1 : 2 }); // preload next page.

  return (
    <SearchPageContainer asChild consumeCss>
      <main>
        <title>{t("htmlTitles.search.audio")}</title>
        <SearchAudioForm userData={userDataQuery.data} />
        <SearchSort
          value={params.get("sort") ?? DEFAULT_PARAMS.sort!}
          onValueChange={(value) => setParams({ sort: value === DEFAULT_PARAMS.sort ? null : value })}
        />
        <SearchListOptions totalCount={searchQuery.data?.totalCount} defaultValue={DEFAULT_PARAMS.pageSize!} />
        <GenericSearchList
          type="audio"
          loading={searchQuery.isLoading}
          error={searchQuery.error}
          query={params.get("query")}
          resultLength={searchQuery.data?.totalCount ?? 0}
        >
          {searchQuery.data?.results.map((audio) => (
            <SearchAudio audio={audio} key={audio.id} />
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
