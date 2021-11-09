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
