/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { i18n } from "i18next";
import { IMultiSearchSummary } from "@ndla/types-backend/search-api";

export const sortMoviesByIdList = (
  idList: number[],
  movieList: IMultiSearchSummary[],
  i18n: i18n,
): IMultiSearchSummary[] => {
  const notFoundMovie: IMultiSearchSummary = {
    id: -1,
    title: {
      title: i18n.t("ndlaFilm.editor.notFound"),
      htmlTitle: i18n.t("ndlaFilm.editor.notFound"),
      language: i18n.language,
    },
    supportedLanguages: [],
    metaDescription: {
      metaDescription: "",
      language: "",
    },
    url: "",
    contexts: [],
    learningResourceType: "standard",
    traits: [],
    score: -1,
    highlights: [],
    paths: [],
    lastUpdated: "",
    revisions: [],
    resultType: "article",
  };

  return idList.map(
    (id) =>
      movieList.find((movie) => movie.id === id) || {
        ...notFoundMovie,
        id: id,
      },
  );
};
