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
import { searchNormal } from '../../modules/search/searchApi';
import handleError from '../../util/handleError';
import ThemeEditor from './components/ThemeEditor';
import SlideshowEditor from './components/SlideshowEditor';
import {
  restructureFilmFrontpage,
  getIdFromUrn,
  getUrnFromId,
} from '../../util/ndlaFilmHelpers';

class NdlaFilmEditor extends React.Component {
  state = {
    slideshow: null,
    themes: null,
    filmFrontpage: null,
    allMovies: null,
  };

  async componentDidMount() {
    try {
      const filmFrontpage = await fetchFilmFrontpage();
      const newFilmFrontpage = restructureFilmFrontpage(filmFrontpage);
      const allMovies = await this.fetchAllMovies();
      this.setState({
        allMovies: allMovies,
        filmFrontpage: newFilmFrontpage,
      });

      const { slideShow, movieThemes } = filmFrontpage;
      this.getSlideshow(slideShow);
      this.getThemes(movieThemes);
    } catch (err) {
      handleError(err);
    }
  }

  getSlideshow = async slideShowUrnIds => {
    const slideshowIds = slideShowUrnIds.map(getIdFromUrn);
    const slideshowResult = await this.queryArticles(slideshowIds.join());
    const correctOrderSlideshow = slideshowIds.map(id =>
      slideshowResult.find(slidehow => slidehow.id.toString() === id),
    );
    this.setState({ slideshow: correctOrderSlideshow });
  };

  getThemes = async movieThemes => {
    if (movieThemes) {
      const fetchThemes = movieThemes.map(this.restructureTheme);
      const themes = await Promise.all(fetchThemes);
      this.setState({ themes });
    }
  };

  restructureTheme = async movieTheme => {
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
    const response = await searchNormal(query);
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
    const response = await searchNormal(query);
    return response.results;
  };

  refreshProps = newFilmFrontpage => {
    const { slideShow, movieThemes } = newFilmFrontpage;
    this.getThemes(movieThemes);
    this.getSlideshow(slideShow);
    this.setState({
      filmFrontpage: newFilmFrontpage,
    });
  };

  onAddMovieToSlideshow = id => {
    const { filmFrontpage } = this.state;
    const { slideShow } = filmFrontpage;

    const newSlideShow = [...slideShow, getUrnFromId(id)];

    this.newSlideShow(newSlideShow);
  };

  saveSlideshow = slideShow => {
    const ids = slideShow.map(movie => getUrnFromId(movie.id));
    this.newSlideShow(ids);
  };

  newSlideShow = newSlideShow => {
    const { filmFrontpage } = this.state;
    const newFilmFrontpage = {
      ...filmFrontpage,
      slideShow: newSlideShow,
    };
    this.saveFilmFrontpage(newFilmFrontpage);
  };

  saveFilmFrontpage = newFilmFrontpage => {
    updateFilmFrontpage(newFilmFrontpage);
    this.refreshProps(newFilmFrontpage);
  };

  onSaveThemeName = (newNames, index) => {
    const { themes } = this.state;
    const oldTheme = themes[index];
    const newThemeNames = this.convertThemeNames(newNames);

    const newTheme = {
      ...oldTheme,
      name: newThemeNames,
    };
    this.updateThemeName(newTheme, index);
  };

  updateThemeName = (updatedTheme, index) => {
    const movieIds = updatedTheme.movies.map(movie => getUrnFromId(movie.id));
    const { filmFrontpage } = this.state;
    const { movieThemes } = filmFrontpage;

    const newFilmFrontpage = {
      ...filmFrontpage,
      movieThemes: movieThemes.map((theme, i) => {
        if (i === index) {
          return {
            ...updatedTheme,
            movies: movieIds,
          };
        }
        return theme;
      }),
    };
    this.saveFilmFrontpage(newFilmFrontpage);
  };

  updateMovieTheme = (updatedTheme, index) => {
    const movieIds = updatedTheme.map(movie => getUrnFromId(movie.id));
    const { filmFrontpage } = this.state;
    const { movieThemes } = filmFrontpage;

    const newFilmFrontpage = {
      ...filmFrontpage,
      movieThemes: movieThemes.map((theme, i) => {
        if (i === index) {
          return {
            ...theme,
            movies: movieIds,
          };
        }
        return theme;
      }),
    };
    this.saveFilmFrontpage(newFilmFrontpage);
  };

  addMovieToTheme = (id, index) => {
    const { filmFrontpage } = this.state;
    const urnId = getUrnFromId(id);

    const newFilmFrontpage = {
      ...filmFrontpage,
      movieThemes: filmFrontpage.movieThemes.map((theme, i) => {
        if (i === index) {
          return {
            ...theme,
            movies: [...theme.movies, urnId],
          };
        }
        return theme;
      }),
    };
    this.saveFilmFrontpage(newFilmFrontpage);
  };

  onMoveTheme = (index, direction) => {
    const { filmFrontpage } = this.state;
    if (
      index + direction >= 0 &&
      filmFrontpage.movieThemes.length > index + direction
    ) {
      const desiredNewIndex = index + direction;
      const { movieThemes } = filmFrontpage;

      const newMovieThemes = movieThemes.map((movieTheme, i) => {
        if (i === index) {
          return movieThemes[desiredNewIndex];
        } else if (i === desiredNewIndex) {
          return movieThemes[index];
        }
        return movieTheme;
      });

      const newFilmFrontpage = {
        ...filmFrontpage,
        movieThemes: newMovieThemes,
      };
      this.saveFilmFrontpage(newFilmFrontpage);
    }
  };

  onDeleteTheme = index => {
    const { filmFrontpage } = this.state;
    const newFilmFrontpage = {
      ...filmFrontpage,
      movieThemes: filmFrontpage.movieThemes.filter((theme, i) => i !== index),
    };
    this.saveFilmFrontpage(newFilmFrontpage);
  };

  convertThemeNames = names => {
    return ['nb', 'nn', 'en'].map(lang => ({
      language: lang,
      name: names.name[lang],
    }));
  };

  onAddTheme = theme => {
    const { filmFrontpage } = this.state;

    const newThemeNames = this.convertThemeNames(theme);

    const newFilmFrontpage = {
      ...filmFrontpage,
      movieThemes: [
        ...filmFrontpage.movieThemes,
        { name: newThemeNames, movies: [] },
      ],
    };
    this.saveFilmFrontpage(newFilmFrontpage);
  };

  findName = (themeNames, language) => {
    const filteredName = themeNames.filter(name => name.language === language);
    return filteredName.length > 0
      ? filteredName.map(name => name.name).join()
      : '';
  };

  render() {
    const { t } = this.props;
    const { slideshow, themes, allMovies } = this.state;

    return (
      <OneColumn>
        <StyledSection data-cy="slideshow-section">
          <h1>{t('ndlaFilm.editor.slideshowHeader')}</h1>
          <SlideshowEditor
            slideshowmovies={slideshow}
            allMovies={allMovies}
            saveSlideshow={this.saveSlideshow}
            onAddMovieToSlideshow={this.onAddMovieToSlideshow}
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
            findName={this.findName}
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
