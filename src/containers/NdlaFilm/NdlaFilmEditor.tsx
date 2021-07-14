/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useEffect, useState } from 'react';
//@ts-ignore
import { OneColumn } from '@ndla/ui';
import { injectT, tType } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import { fetchFilmFrontpage } from '../../modules/frontpage/frontpageApi';
import { searchResources } from '../../modules/search/searchApi';
import handleError from '../../util/handleError';
import { getIdFromUrn } from '../../util/ndlaFilmHelpers';
import { NDLA_FILM_SUBJECT } from '../../constants';
import NdlaFilmForm from './components/NdlaFilmForm';
import Spinner from '../../components/Spinner';
import { MultiSearchSummary } from '../../modules/search/searchApiInterfaces';
import { FilmFrontpageApiType, MovieTheme } from '../../modules/frontpage/frontpageApiInterfaces';

interface Props {
  selectedLanguage: string;
}

export interface BaseMovie {
  id: number;
  title: {
    title: string;
    language?: string;
  };
  metaImage?: {
    url: string;
    alt: string;
    language: string;
  };
  articleType?: string;
}

export interface NdlaEditMovieThemeType {
  name: {
    name: string;
    language: string;
  }[];
  movies: BaseMovie[];
}

const NdlaFilmEditor = ({ selectedLanguage, t }: Props & tType) => {
  const [filmFrontpage, setFilmFrontpage] = useState<FilmFrontpageApiType>();
  const [slideshowMovies, setSlideshowMovies] = useState<BaseMovie[]>([]);
  const [themes, setThemes] = useState<NdlaEditMovieThemeType[]>([]);
  const [allMovies, setAllMovies] = useState<MultiSearchSummary[]>([]);
  const [language, setLanguage] = useState(selectedLanguage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const filmFrontpage = await fetchFilmFrontpage();
        const allMovies = await fetchAllMovies();
        await fetchMovies(filmFrontpage);
        setFilmFrontpage(filmFrontpage);
        setAllMovies(allMovies);
        setLoading(false);
      } catch (err) {
        handleError(err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFilmFrontpage = async (filmFrontpage: any) => {
    await fetchMovies(filmFrontpage);
    setFilmFrontpage(filmFrontpage);
  };

  const fetchMovies = async (filmFrontpage: FilmFrontpageApiType) => {
    const { slideShow, movieThemes } = filmFrontpage;
    const slideshowMovies = await getSlideshow(slideShow);
    const themes = await getThemes(movieThemes);
    setSlideshowMovies(slideshowMovies);
    setThemes(themes);
  };

  const getSlideshow = async (slideShowUrnIds: string[]): Promise<BaseMovie[]> => {
    if (slideShowUrnIds.length === 0) return [];
    const slideshowIds = slideShowUrnIds.map(getIdFromUrn);
    const slideshowResult = await queryArticles(slideshowIds.join());
    const correctOrderSlideshow = sortMoviesByIdList(slideshowIds, slideshowResult);
    const withArticleType = addArticleType(correctOrderSlideshow);
    return withArticleType;
  };

  const getThemes = async (movieThemes: MovieTheme[]) => {
    const fetchThemes = movieThemes.map(fetchThemeMetaData);
    const themes = await Promise.all(fetchThemes).then(t => t.filter(e => e));
    return themes;
  };

  const fetchThemeMetaData = async (movieTheme: MovieTheme): Promise<NdlaEditMovieThemeType> => {
    const movieThemeIds = movieTheme.movies.map(getIdFromUrn);
    if (movieThemeIds.length > 0) {
      const fetchedMovies = await queryArticles(movieThemeIds.join());
      const sortedMovies = sortMoviesByIdList(movieThemeIds, fetchedMovies);
      const withArticleType = addArticleType(sortedMovies);
      return { ...movieTheme, movies: withArticleType };
    }
    return { ...movieTheme, movies: [] };
  };

  const addArticleType = (
    movieList: (BaseMovie & { learningResourceType?: string })[],
  ): BaseMovie[] => {
    return movieList.map(movie => {
      return { ...movie, articleType: movie.learningResourceType };
    });
  };

  const sortMoviesByIdList = (idList: number[], movieList: MultiSearchSummary[]): BaseMovie[] => {
    const notFoundMovie = { title: { title: t('ndlaFilm.editor.notFound') } };
    return idList.map(
      id =>
        movieList.find(movie => movie.id === id) || {
          ...notFoundMovie,
          id: id,
        },
    );
  };

  const fetchAllMovies = async (): Promise<MultiSearchSummary[]> => {
    const query = {
      page: 1,
      subjects: NDLA_FILM_SUBJECT,
      'context-types': 'standard',
      sort: '-relevance',
      'page-size': 10000,
    };
    const response = await searchResources(query);
    return response.results;
  };

  const queryArticles = async (ids: string): Promise<MultiSearchSummary[]> => {
    const query = {
      page: 1,
      'context-types': 'standard',
      sort: '-relevance',
      'page-size': 10000,
      ids: ids,
    };
    const response = await searchResources(query);
    return response.results;
  };

  if (selectedLanguage !== language) {
    setLanguage(selectedLanguage);
  }

  if (loading || !filmFrontpage || !themes) {
    return <Spinner withWrapper />;
  }

  return (
    <OneColumn>
      <HelmetWithTracker title={t('htmlTitles.ndlaFilmPage')} />
      <NdlaFilmForm
        filmFrontpage={filmFrontpage}
        updateFilmFrontpage={updateFilmFrontpage}
        slideshowMovies={slideshowMovies}
        themes={themes}
        selectedLanguage={language}
        allMovies={allMovies}
        loading={loading}
      />
    </OneColumn>
  );
};

export default injectT(NdlaFilmEditor);
