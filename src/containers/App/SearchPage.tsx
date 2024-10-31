/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from "query-string";
import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import { UseQueryResult } from "@tanstack/react-query";
import { List } from "@ndla/icons/action";
import { SearchMedia, SearchContent, SquareAudio } from "@ndla/icons/editor";
import Footer from "./components/FooterWrapper";
import { SearchType } from "../../interfaces";
import { useSearchAudio, useSearchSeries } from "../../modules/audio/audioQueries";
import { useSearchImages } from "../../modules/image/imageQueries";
import { useSearchWithCustomSubjectsFiltering } from "../../modules/search/searchQueries";
import { toSearch } from "../../util/routeHelpers";
import SubNavigation from "../Masthead/components/SubNavigation";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { SearchParams, SearchParamsBody, parseSearchParams } from "../SearchPage/components/form/SearchForm";
import SearchContainer, { ResultType } from "../SearchPage/SearchContainer";

const SearchPage = () => {
  const { t } = useTranslation();
  const supportedTypes: {
    title: string;
    type: SearchType;
    url: string;
    icon: ReactElement;
    path: string;
    searchHook: (query: SearchParamsBody) => UseQueryResult<ResultType>;
  }[] = [
    {
      title: t("subNavigation.searchContent"),
      type: "content",
      url: toSearch(
        {
          page: "1",
          sort: "-lastUpdated",
          "page-size": 10,
        },
        "content",
      ),
      icon: <SearchContent />,
      path: "content",
      searchHook: useSearchWithCustomSubjectsFiltering,
    },
    {
      title: t("subNavigation.searchAudio"),
      type: "audio",
      url: toSearch(
        {
          page: "1",
          sort: "-relevance",
          "page-size": 10,
        },
        "audio",
      ),
      icon: <SquareAudio />,
      path: "audio",
      searchHook: useSearchAudio,
    },
    {
      title: t("subNavigation.searchImage"),
      type: "image",
      url: toSearch(
        {
          page: "1",
          sort: "-relevance",
          "page-size": 10,
        },
        "image",
      ),
      icon: <SearchMedia />,
      path: "image",
      searchHook: useSearchImages,
    },
    {
      title: t("subNavigation.searchPodcastSeries"),
      type: "podcast-series",
      url: toSearch({ page: "1", sort: "-relevance", "page-size": 10 }, "podcast-series"),
      icon: <List />,
      path: "podcast-series",
      searchHook: useSearchSeries,
    },
  ];

  return (
    <>
      <SubNavigation subtypes={supportedTypes} />
      <Routes>
        {supportedTypes.map((type) => {
          return (
            <Route
              key={type.type}
              path={`${type.path}/*`}
              element={
                <PrivateRoute
                  key={type.type}
                  component={
                    <SearchContainer
                      searchHook={(query: SearchParams) => {
                        const toBody = parseSearchParams(queryString.stringify(query), true);
                        return type.searchHook(toBody);
                      }}
                      type={type.type}
                    />
                  }
                />
              }
            />
          );
        })}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer showLocaleSelector={false} />
    </>
  );
};

export default SearchPage;
