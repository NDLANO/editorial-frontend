/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';
import { useTranslation } from 'react-i18next';
import { Spinner } from '@ndla/icons';
import { IMultiSearchSummary } from '@ndla/types-backend/search-api';
import ElementList from '../../FormikForm/components/ElementList';
import { getUrnFromId } from '../../../util/ndlaFilmHelpers';
import DropdownSearch from './DropdownSearch';
import { NDLA_FILM_SUBJECT } from '../../../constants';
import { useMoviesQuery } from '../../../modules/frontpage/filmQueries';

interface Props {
  movies: string[];
  onMoviesUpdated: (movies: string[]) => void;
  placeholder: string;
}

export const ThemeMovies = ({ movies, onMoviesUpdated, placeholder }: Props) => {
  const { t } = useTranslation();
  const [localMovies, setLocalMovies] = useState<string[]>([]);
  const [apiMovies, setApiMovies] = useState<IMultiSearchSummary[]>([]);
  const moviesQuery = useMoviesQuery(
    { movieUrns: movies },
    { enabled: !isEqual(movies, localMovies) },
  );

  useEffect(() => {
    if (moviesQuery.isSuccess) {
      setApiMovies(moviesQuery.data.results);
    }
  }, [moviesQuery.data?.results, moviesQuery.isSuccess]);

  const onUpdateMovies = (updates: IMultiSearchSummary[]) => {
    const updated = updates.map((u) => getUrnFromId(u.id));
    setApiMovies(updates);
    setLocalMovies(updated);
    onMoviesUpdated(updated);
  };

  const onAddMovieToTheme = (movie: IMultiSearchSummary) => {
    setLocalMovies([...movies, getUrnFromId(movie.id)]);
    setApiMovies((prevMovies) => [...prevMovies, movie]);
    onMoviesUpdated([...movies, getUrnFromId(movie.id)]);
  };

  return (
    <>
      {moviesQuery.isLoading ? (
        <Spinner />
      ) : (
        <ElementList
          articleType="standard"
          elements={apiMovies}
          messages={{
            dragElement: t('ndlaFilm.editor.changeOrder'),
            removeElement: t('ndlaFilm.editor.removeMovieFromGroup'),
          }}
          onUpdateElements={(elements: IMultiSearchSummary[]) => onUpdateMovies(elements)}
        />
      )}

      <DropdownSearch
        selectedElements={apiMovies}
        onChange={(movie: IMultiSearchSummary) => onAddMovieToTheme(movie)}
        subjectId={NDLA_FILM_SUBJECT}
        contextTypes={'standard'}
        placeholder={placeholder}
        clearInputField
      />
    </>
  );
};
