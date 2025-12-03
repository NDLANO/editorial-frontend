/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import SearchAudioForm from "./components/form/SearchAudioForm";
import { GenericSearchList } from "./components/GenericSearchList";
import SearchAudio from "./components/results/SearchAudio";
import { useSearchAudio } from "../../modules/audio/audioQueries";
import { useUserData } from "../../modules/draft/draftQueries";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { SearchPageContainer } from "./components/SearchPageContainer";
import { getAccessToken, isActiveToken } from "../../util/authHelpers";
import { parseSearchParams } from "./components/form/SearchForm";
import SearchListOptions from "./components/results/SearchListOptions";
import SearchSort from "./components/sort/SearchSort";
import { useStableSearchPageParams } from "./useStableSearchPageParams";
import Pagination from "../../components/abstractions/Pagination";

export const Component = () => <PrivateRoute component={<AudioSearch />} />;

export const AudioSearch = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [params, setParams] = useStableSearchPageParams();

  const userDataQuery = useUserData({
    enabled: isActiveToken(getAccessToken()),
  });

  const parsedParams = parseSearchParams(location.search, true);

  const searchQuery = useSearchAudio(parsedParams);
  useSearchAudio({ ...parsedParams, page: parsedParams.page ? parsedParams.page + 1 : 2 }); // preload next page.

  return (
    <SearchPageContainer asChild consumeCss>
      <main>
        <title>{t("htmlTitles.search.audio")}</title>
        <SearchAudioForm userData={userDataQuery.data} />
        <SearchSort type="audio" />
        <SearchListOptions totalCount={searchQuery.data?.totalCount} />
        <GenericSearchList
          type="audio"
          loading={searchQuery.isLoading}
          error={searchQuery.error}
          resultLength={searchQuery.data?.totalCount ?? 0}
        >
          {searchQuery.data?.results.map((audio) => (
            <SearchAudio audio={audio} key={audio.id} />
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
