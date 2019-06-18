/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { OneColumn } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import {
  updateFilmFrontpage,
  fetchFilmFrontpage,
} from '../../modules/frontpage/frontpageApi';
import { searchResources } from '../../modules/search/searchApi';
import handleError from '../../util/handleError';
import ThemeEditor from './components/ThemeEditor';
import SlideshowEditor from './components/SlideshowEditor';
import {
  restructureFilmFrontpage,
  getIdFromUrn,
  getUrnFromId,
  changeThemeNames,
  changeMoviesInTheme,
  addMovieToTheme,
  convertThemeNames,
} from '../../util/ndlaFilmHelpers';

class NdlaFilmEditor extends React.Component {
  state = {
    slideshowMovies: undefined,
    themes: undefined,
    filmFrontpage: undefined,
    allMovies: undefined,
    loadingThemes: true,
    loadingSlideshow: true,
  };

  async componentDidMount() {
    try {
      const fetchedFilmFrontpage = await fetchFilmFrontpage();
      const filmFrontpage = restructureFilmFrontpage(fetchedFilmFrontpage);
      const allMovies = await this.fetchAllMovies();
      const { slideShow, movieThemes } = fetchedFilmFrontpage;
      const slideshowMovies = await this.getSlideshow(slideShow);
      const themes = await this.getThemes(movieThemes);
      this.setState({
        allMovies,
        filmFrontpage,
        slideshowMovies,
        themes,
        loadingThemes: false,
        loadingSlideshow: false,
      });
    } catch (err) {
      handleError(err);
    }
  }

  getSlideshow = async slideShowUrnIds => {
    if (slideShowUrnIds.length === 0) return [];
    const slideshowIds = slideShowUrnIds.map(getIdFromUrn);
    const slideshowResult = await this.queryArticles(slideshowIds.join());
    const correctOrderSlideshow = slideshowIds.map(id =>
      slideshowResult.find(slidehow => slidehow.id.toString() === id),
    );
    return correctOrderSlideshow;
  };

  getThemes = async movieThemes => {
    if (movieThemes) {
      const fetchThemes = movieThemes.map(this.fetchThemeMetaData);
      const themes = await Promise.all(fetchThemes);
      return themes;
    }
    return undefined;
  };

  fetchThemeMetaData = async movieTheme => {
    const movieThemeIds = movieTheme.movies.map(getIdFromUrn);
    if (movieThemeIds.length > 0) {
      const fetchedMovies = await this.queryArticles(movieThemeIds.join());
      const sortedMovies = movieThemeIds.map(id =>
        fetchedMovies.find(movie => movie.id.toString() === id),
      );
      return { ...movieTheme, movies: sortedMovies };
    }
    return movieTheme;
  };

  fetchAllMovies = async () => {
    const query = {
      page: 1,
      subjects: 'urn:subject:20',
      'context-types': 'topic-article',
      sort: '-relevance',
      'page-size': 100,
    };
    const response = await searchResources(query);
    return response.results;
  };

  queryArticles = async ids => {
    const query = {
      page: 1,
      'context-types': 'topic-article',
      sort: '-relevance',
      'page-size': 10,
      ids: ids,
    };
    const response = await searchResources(query);
    return response.results;
  };

  onAddMovieToSlideshow = newMovie => {
    this.setState(
      prevState => ({
        slideshowMovies: [
          ...prevState.slideshowMovies,
          prevState.allMovies.find(movie => movie.id === newMovie.id),
        ],
        filmFrontpage: {
          ...prevState.filmFrontpage,
          slideShow: [
            ...prevState.filmFrontpage.slideShow,
            getUrnFromId(newMovie.id),
          ],
        },
      }),
      this.saveFilmFrontpage,
    );
  };

  saveSlideshow = slideshowMovies => {
    this.setState(
      prevState => ({
        slideshowMovies,
        filmFrontpage: {
          ...prevState.filmFrontpage,
          slideShow: slideshowMovies.map(movie => getUrnFromId(movie.id)),
        },
      }),
      this.saveFilmFrontpage,
    );
  };

  saveFilmFrontpage = async () => {
    try {
      const { filmFrontpage } = this.state;
      await updateFilmFrontpage(filmFrontpage);
    } catch (err) {
      handleError(err);
    }
  };

  onSaveThemeName = (newNames, index) => {
    const newThemeNames = convertThemeNames(newNames);
    this.updateThemeName(newThemeNames, index);
  };

  updateThemeName = (newThemeNames, index) => {
    this.setState(
      prevState => ({
        themes: changeThemeNames(prevState.themes, newThemeNames, index),
        filmFrontpage: {
          ...prevState.filmFrontpage,
          movieThemes: changeThemeNames(
            prevState.filmFrontpage.movieThemes,
            newThemeNames,
            index,
          ),
        },
      }),
      this.saveFilmFrontpage,
    );
  };

  updateMovieTheme = (updatedThemeMovies, index) => {
    const movieIds = updatedThemeMovies.map(movie => getUrnFromId(movie.id));
    this.setState(
      prevState => ({
        themes: changeMoviesInTheme(
          prevState.themes,
          index,
          updatedThemeMovies,
        ),
        filmFrontpage: {
          ...prevState.filmFrontpage,
          movieThemes: changeMoviesInTheme(
            prevState.filmFrontpage.movieThemes,
            index,
            movieIds,
          ),
        },
      }),
      this.saveFilmFrontpage,
    );
  };

  addMovieToTheme = (id, index) => {
    this.setState(
      prevState => ({
        themes: addMovieToTheme(
          prevState.themes,
          index,
          prevState.allMovies.find(movie => movie.id.toString() === id),
        ),
        filmFrontpage: {
          ...prevState.filmFrontpage,
          movieThemes: addMovieToTheme(
            prevState.filmFrontpage.movieThemes,
            index,
            getUrnFromId(id),
          ),
        },
      }),
      this.saveFilmFrontpage,
    );
  };

  onMoveTheme = (index, direction) => {
    this.setState(prevState => {
      const { filmFrontpage } = prevState;
      if (
        index + direction >= 0 &&
        filmFrontpage.movieThemes.length > index + direction
      ) {
        const desiredNewIndex = index + direction;
        const { movieThemes } = filmFrontpage;

        const newMovieThemes = this.rearrangeTheme(
          movieThemes,
          index,
          desiredNewIndex,
        );

        const newFilmFrontpage = {
          ...filmFrontpage,
          movieThemes: newMovieThemes,
        };
        return {
          themes: this.rearrangeTheme(prevState.themes, index, desiredNewIndex),
          filmFrontpage: newFilmFrontpage,
        };
      }
      return prevState;
    }, this.saveFilmFrontpage);
  };

  rearrangeTheme = (themes, index, desiredNewIndex) => {
    return themes.map((theme, i) => {
      if (i === index) {
        return themes[desiredNewIndex];
      } else if (i === desiredNewIndex) {
        return themes[index];
      }
      return theme;
    });
  };

  onDeleteTheme = index => {
    this.setState(
      prevState => ({
        themes: prevState.themes.filter((theme, i) => i !== index),
        filmFrontpage: {
          ...prevState.filmFrontpage,
          movieThemes: prevState.filmFrontpage.movieThemes.filter(
            (theme, i) => i !== index,
          ),
        },
      }),
      this.saveFilmFrontpage,
    );
  };

  onAddTheme = theme => {
    const newTheme = { name: convertThemeNames(theme), movies: [] };

    this.setState(
      prevState => ({
        themes: [...prevState.themes, newTheme],
        filmFrontpage: {
          ...prevState.filmFrontpage,
          movieThemes: [...prevState.filmFrontpage.movieThemes, newTheme],
        },
      }),
      this.saveFilmFrontpage,
    );
  };

  render() {
    const { t } = this.props;
    const {
      slideshowMovies,
      themes,
      allMovies,
      loadingThemes,
      loadingSlideshow,
    } = this.state;

    return (
      <OneColumn>
        <StyledSection data-cy="slideshow-section">
          <h1>{t('ndlaFilm.editor.slideshowHeader')}</h1>
          <SlideshowEditor
            slideshowMovies={slideshowMovies}
            allMovies={allMovies}
            saveSlideshow={this.saveSlideshow}
            onAddMovieToSlideshow={this.onAddMovieToSlideshow}
            loading={loadingSlideshow}
          />
        </StyledSection>
        <StyledSection>
          <h1>{t('ndlaFilm.editor.movieGroupHeader')}</h1>
          <ThemeEditor
            themes={themes}
            allMovies={allMovies}
            updateMovieTheme={this.updateMovieTheme}
            addMovieToTheme={this.addMovieToTheme}
            onMoveTheme={this.onMoveTheme}
            onDeleteTheme={this.onDeleteTheme}
            onAddTheme={this.onAddTheme}
            updateThemeName={this.updateThemeName}
            onSaveThemeName={this.onSaveThemeName}
            loading={loadingThemes}
          />
        </StyledSection>
      </OneColumn>
    );
  }
}

const StyledSection = styled('section')`
  margin-top: ${spacing.spacingUnit * 4}px;
`;

export default injectT(NdlaFilmEditor);
