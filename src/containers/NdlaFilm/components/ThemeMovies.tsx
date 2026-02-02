/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Draggable } from "@ndla/icons";
import { ComboboxLabel, FieldRoot, Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { isEqual } from "lodash-es";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../components/abstractions/Combobox";
import DndList from "../../../components/DndList";
import { DragHandle } from "../../../components/DraggableItem";
import { GenericSearchCombobox } from "../../../components/Form/GenericSearchCombobox";
import ListResource from "../../../components/Form/ListResource";
import { NDLA_FILM_SUBJECT } from "../../../constants";
import { useMoviesQuery } from "../../../modules/frontpage/filmQueries";
import { useSearchResources } from "../../../modules/search/searchQueries";
import { routes } from "../../../util/routeHelpers";
import { usePaginatedQuery } from "../../../util/usePaginatedQuery";
import { getUrnFromId } from "../ndlaFilmHelpers";

const StyledList = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxsmall",
    listStyle: "none",
  },
});

interface Props {
  movies: string[];
  onMoviesUpdated: (movies: string[]) => void;
  placeholder: string;
  comboboxLabel: string;
}

export const ThemeMovies = ({ movies, onMoviesUpdated, placeholder, comboboxLabel }: Props) => {
  const { i18n, t } = useTranslation();
  const [localMovies, setLocalMovies] = useState<string[]>([]);
  const [apiMovies, setApiMovies] = useState<MultiSearchSummaryDTO[]>([]);
  const moviesQuery = useMoviesQuery({ movieUrns: movies }, { enabled: !isEqual(movies, localMovies) });

  const { query, page, setPage, delayedQuery, setQuery } = usePaginatedQuery();

  const searchQuery = useSearchResources({
    page,
    query: delayedQuery,
    subjects: [NDLA_FILM_SUBJECT],
    pageSize: 10,
    contextTypes: ["standard"],
    sort: "-relevance",
    resourceTypes: [
      "urn:resourcetype:documentary",
      "urn:resourcetype:featureFilm",
      "urn:resourcetype:series",
      "urn:resourcetype:shortFilm",
    ],
  });

  useEffect(() => {
    if (moviesQuery.isSuccess && !apiMovies.length) {
      setApiMovies(moviesQuery.data.results);
    }
  }, [apiMovies.length, moviesQuery.data?.results, moviesQuery.isSuccess]);

  const onUpdateMovies = (updates: MultiSearchSummaryDTO[]) => {
    const updated = updates.map((u) => getUrnFromId(u.id));
    setApiMovies(updates);
    setLocalMovies(updated);
    onMoviesUpdated(updated);
  };

  const onValueChange = (value: string) => {
    if (movies.includes(value)) {
      onUpdateMovies(apiMovies.filter((m) => getUrnFromId(m.id) !== value));
    } else {
      const apiMovie = searchQuery.data?.results.find((m) => getUrnFromId(m.id) === value);
      if (!apiMovie) return;
      onUpdateMovies([...apiMovies, apiMovie]);
    }
  };

  return (
    <FieldRoot>
      <GenericSearchCombobox
        items={searchQuery.data?.results ?? []}
        itemToString={(item) => item.title.title}
        itemToValue={(item) => getUrnFromId(item.id)}
        inputValue={query}
        paginationData={searchQuery.data}
        onInputValueChange={(details) => setQuery(details.inputValue)}
        onPageChange={(details) => setPage(details.page)}
        isSuccess={searchQuery.isSuccess}
        onValueChange={(details) => {
          const newValue = details.value[0];
          if (!newValue) return;
          onValueChange(newValue);
        }}
        value={movies}
        renderItem={(item) => (
          <GenericComboboxItemContent
            title={item.title.title}
            description={item.metaDescription.metaDescription}
            image={item.metaImage}
            useFallbackImage
            data-testid="dropdown-item"
          />
        )}
        closeOnSelect={false}
        selectionBehavior="preserve"
      >
        <ComboboxLabel>{comboboxLabel}</ComboboxLabel>
        <GenericComboboxInput
          placeholder={placeholder}
          isFetching={searchQuery.isFetching}
          data-testid="dropdown-input"
        />
      </GenericSearchCombobox>
      {moviesQuery.isLoading ? (
        <Spinner />
      ) : (
        <StyledList>
          <DndList
            items={apiMovies}
            dragHandle={
              <DragHandle aria-label={t("ndlaFilm.editor.changeOrder")}>
                <Draggable />
              </DragHandle>
            }
            renderItem={(item) => (
              <ListResource
                key={item.id}
                title={item.title.title}
                metaImage={item.metaImage}
                url={routes.editArticle(item.id, item.learningResourceType ?? "standard", i18n.language)}
                onDelete={() => onValueChange(getUrnFromId(item.id))}
                removeElementTranslation={t("ndlaFilm.editor.removeMovieFromGroup")}
              />
            )}
            onDragEnd={(_, newArray) => onUpdateMovies(newArray)}
          />
        </StyledList>
      )}
    </FieldRoot>
  );
};
