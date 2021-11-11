/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { i18n } from 'i18next';
import { MultiSearchSummary } from '../../modules/search/searchApiInterfaces';

export const sortMoviesByIdList = (
  idList: number[],
  movieList: MultiSearchSummary[],
  i18n: i18n,
): MultiSearchSummary[] => {
  const notFoundMovie = {
    title: { title: i18n.t('ndlaFilm.editor.notFound'), language: i18n.language },
    supportedLanguages: [],
    metaDescription: {
      metaDescription: '',
      language: '',
    },
    url: '',
    contexts: [],
    learningResourceType: '',
    traits: [],
    score: -1,
    highlights: [],
    paths: [],
  };
  return idList.map(
    id =>
      movieList.find(movie => movie.id === id) || {
        ...notFoundMovie,
        id: id,
      },
  );
};
