/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import isEqual from "lodash/isEqual";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DragVertical } from "@ndla/icons/editor";
import { IMultiSearchSummary } from "@ndla/types-backend/search-api";
import DropdownSearch from "./DropdownSearch";
import DndList from "../../../components/DndList";
import { DragHandle } from "../../../components/DraggableItem";
import ListResource from "../../../components/Form/ListResource";
import { OldSpinner } from "../../../components/OldSpinner";
import { NDLA_FILM_SUBJECT } from "../../../constants";
import { useMoviesQuery } from "../../../modules/frontpage/filmQueries";
import { getUrnFromId } from "../../../util/ndlaFilmHelpers";

interface Props {
  movies: string[];
  onMoviesUpdated: (movies: string[]) => void;
  placeholder: string;
}

export const ThemeMovies = ({ movies, onMoviesUpdated, placeholder }: Props) => {
  const { t } = useTranslation();
  const [localMovies, setLocalMovies] = useState<string[]>([]);
  const [apiMovies, setApiMovies] = useState<IMultiSearchSummary[]>([]);
  const moviesQuery = useMoviesQuery({ movieUrns: movies }, { enabled: !isEqual(movies, localMovies) });

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

  const onDeleteElement = (elements: IMultiSearchSummary[], deleteIndex: number) => {
    const newElements = elements.filter((_, i) => i !== deleteIndex);
    onUpdateMovies(newElements);
  };

  const onAddMovieToTheme = (movie: IMultiSearchSummary) => {
    setLocalMovies([...movies, getUrnFromId(movie.id)]);
    setApiMovies((prevMovies) => [...prevMovies, movie]);
    onMoviesUpdated([...movies, getUrnFromId(movie.id)]);
  };

  return (
    <>
      {moviesQuery.isLoading ? (
        <OldSpinner />
      ) : (
        <>
          <DndList
            items={apiMovies}
            dragHandle={
              <DragHandle aria-label={t("ndlaFilm.editor.changeOrder")}>
                <DragVertical />
              </DragHandle>
            }
            renderItem={(item, index) => (
              <ListResource
                key={item.id}
                element={item}
                onDelete={() => onDeleteElement(apiMovies, index)}
                articleType="standard"
                removeElementTranslation={t("ndlaFilm.editor.removeMovieFromGroup")}
              />
            )}
            onDragEnd={(_, newArray) => onUpdateMovies(newArray)}
          />
        </>
      )}
      <DropdownSearch
        selectedElements={apiMovies}
        onChange={(movie: IMultiSearchSummary) => onAddMovieToTheme(movie)}
        subjectId={NDLA_FILM_SUBJECT}
        contextTypes={["standard"]}
        placeholder={placeholder}
        clearInputField
      />
    </>
  );
};
