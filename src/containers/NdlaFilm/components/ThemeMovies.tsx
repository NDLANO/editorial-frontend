import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ElementList from '../../FormikForm/components/ElementList';
import { getUrnFromId } from '../../../util/ndlaFilmHelpers';
import DropdownSearch from './DropdownSearch';
import { NDLA_FILM_SUBJECT } from '../../../constants';
import { useMoviesQuery } from '../filmQueries';
import { MultiSearchResult, MultiSearchSummary } from '../../../modules/search/searchApiInterfaces';
import { getDefaultLanguage } from '../../../config';

interface Props {
  movies: string[];
  onMoviesUpdated: (movies: string[]) => void;
  placeholder: string;
}

const dummyOptimisticResults = (results: MultiSearchSummary[]): MultiSearchResult => ({
  language: getDefaultLanguage(),
  suggestions: [],
  totalCount: 0,
  aggregations: [],
  pageSize: 10,
  results,
});

export const ThemeMovies = ({ movies, onMoviesUpdated, placeholder }: Props) => {
  const { t } = useTranslation();
  const [optimisticResults, setOptimisticResults] = useState<MultiSearchSummary[]>([]);
  const moviesQuery = useMoviesQuery(movies, {
    placeholderData: dummyOptimisticResults(optimisticResults),
  });

  const onUpdateMovies = (updates: MultiSearchSummary[]) =>
    onMoviesUpdated(updates.map(u => getUrnFromId(u.id)));

  const onAddMovieToTheme = (movie: MultiSearchSummary) => {
    const existing = moviesQuery.data?.results ?? [];
    setOptimisticResults([...existing, movie]);
    onMoviesUpdated([...movies, getUrnFromId(movie.id)]);
  };

  return (
    <>
      <ElementList
        elements={moviesQuery.data?.results}
        messages={{
          dragElement: t('ndlaFilm.editor.changeOrder'),
          removeElement: t('ndlaFilm.editor.removeMovieFromGroup'),
        }}
        onUpdateElements={(elements: MultiSearchSummary[]) => onUpdateMovies(elements)}
      />
      <DropdownSearch
        selectedElements={moviesQuery.data?.results ?? []}
        onChange={(movie: MultiSearchSummary) => onAddMovieToTheme(movie)}
        subjectId={NDLA_FILM_SUBJECT}
        contextTypes={'standard'}
        placeholder={placeholder}
        clearInputField
      />
    </>
  );
};
