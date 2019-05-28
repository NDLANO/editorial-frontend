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
} from '../../util/ndlaFilmHelpers';

class NdlaFilmEditor extends React.Component {
  state = {
    slideshowMovies: null,
    themes: null,
    filmFrontpage: null,
    allMovies: null,
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

  onAddMovieToSlideshow = id => {
    const { filmFrontpage, allMovies } = this.state;
    const newMovie = allMovies.find(movie => movie.id.toString() === id);
    this.setState(prevState => ({
      slideshowMovies: [...prevState.slideshowMovies, newMovie],
    }));

    const { slideShow } = filmFrontpage;
    const newSlideShow = [...slideShow, getUrnFromId(id)];

    this.newSlideShow(newSlideShow);
  };

  saveSlideshow = slideshowMovies => {
    this.setState({ slideshowMovies });
    const ids = slideshowMovies.map(movie => getUrnFromId(movie.id));
    this.newSlideShow(ids);
  };

  newSlideShow = newSlideShow => {
    const { filmFrontpage } = this.state;
    const newFilmFrontpage = {
      ...filmFrontpage,
      slideShow: newSlideShow,
    };
    this.setState({ filmFrontpage: newFilmFrontpage });
    this.saveFilmFrontpage(newFilmFrontpage);
  };

  saveFilmFrontpage = async newFilmFrontpage => {
    try {
      await updateFilmFrontpage(newFilmFrontpage);
    } catch (err) {
      handleError(err);
    }
  };

  onSaveThemeName = (newNames, index) => {
    const newThemeNames = this.convertThemeNames(newNames);
    this.updateThemeName(newThemeNames, index);
  };

  updateThemeName = (newThemeNames, index) => {
    const { filmFrontpage } = this.state;
    const { movieThemes } = filmFrontpage;
    const newFilmFrontpage = {
      ...filmFrontpage,
      movieThemes: this.helperThemeName(movieThemes, newThemeNames, index),
    };

    this.saveFilmFrontpage(newFilmFrontpage);

    this.setState(prevState => ({
      themes: this.helperThemeName(prevState.themes, newThemeNames, index),
      filmFrontpage: newFilmFrontpage,
    }));
  };

  helperThemeName = (themes, names, index) => {
    return themes.map((theme, i) =>
      i === index ? { ...theme, name: names } : theme,
    );
  };

  updateMovieTheme = (updatedThemeMovies, index) => {
    const movieIds = updatedThemeMovies.map(movie => getUrnFromId(movie.id));
    const { filmFrontpage } = this.state;
    const { movieThemes } = filmFrontpage;

    const newFilmFrontpage = {
      ...filmFrontpage,
      movieThemes: this.helperUpdateMovieTheme(movieThemes, index, movieIds),
    };
    this.saveFilmFrontpage(newFilmFrontpage);

    this.setState(prevState => ({
      themes: this.helperUpdateMovieTheme(
        prevState.themes,
        index,
        updatedThemeMovies,
      ),
      filmFrontpage: newFilmFrontpage,
    }));
  };

  helperUpdateMovieTheme = (themes, index, movies) => {
    return themes.map((theme, i) =>
      i === index ? { ...theme, movies } : theme,
    );
  };

  addMovieToTheme = (id, index) => {
    const { filmFrontpage, allMovies } = this.state;

    const newFilmFrontpage = {
      ...filmFrontpage,
      movieThemes: this.helperAddMovieToTheme(
        filmFrontpage.movieThemes,
        index,
        getUrnFromId(id),
      ),
    };

    const newMovie = allMovies.find(movie => movie.id.toString() === id);
    this.setState(prevState => ({
      themes: this.helperAddMovieToTheme(prevState.themes, index, newMovie),
      filmFrontpage: newFilmFrontpage,
    }));

    this.saveFilmFrontpage(newFilmFrontpage);
  };

  helperAddMovieToTheme = (themes, index, newMovie) => {
    return themes.map((theme, i) =>
      i === index ? { ...theme, movies: [...theme.movies, newMovie] } : theme,
    );
  };

  onMoveTheme = (index, direction) => {
    const { filmFrontpage } = this.state;
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
      this.saveFilmFrontpage(newFilmFrontpage);

      this.setState(prevState => ({
        themes: this.rearrangeTheme(prevState.themes, index, desiredNewIndex),
        filmFrontpage: newFilmFrontpage,
      }));
    }
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
    const { filmFrontpage } = this.state;
    const newFilmFrontpage = {
      ...filmFrontpage,
      movieThemes: filmFrontpage.movieThemes.filter((theme, i) => i !== index),
    };
    this.saveFilmFrontpage(newFilmFrontpage);
    this.setState(prevState => ({
      themes: prevState.themes.filter((theme, i) => i !== index),
      filmFrontpage: newFilmFrontpage,
    }));
  };

  convertThemeNames = names => {
    return ['nb', 'nn', 'en'].map(lang => ({
      language: lang,
      name: names.name[lang],
    }));
  };

  onAddTheme = theme => {
    const { filmFrontpage } = this.state;
    const newTheme = { name: this.convertThemeNames(theme), movies: [] };

    const newFilmFrontpage = {
      ...filmFrontpage,
      movieThemes: [...filmFrontpage.movieThemes, newTheme],
    };
    this.saveFilmFrontpage(newFilmFrontpage);

    this.setState(prevState => ({
      themes: [...prevState.themes, newTheme],
      filmFrontpage: newFilmFrontpage,
    }));
  };

  findName = (themeNames, language) => {
    const filteredName = themeNames.filter(name => name.language === language);
    return filteredName.length > 0
      ? filteredName.map(name => name.name).join()
      : '';
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
            findName={this.findName}
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
