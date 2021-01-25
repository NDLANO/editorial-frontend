/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { OneColumn } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import { fetchFilmFrontpage } from '../../modules/frontpage/frontpageApi';
import { searchResources } from '../../modules/search/searchApi';
import handleError from '../../util/handleError';
import { getIdFromUrn } from '../../util/ndlaFilmHelpers';
import config from '../../config';
import NdlaFilmForm from './components/NdlaFilmForm';
import Spinner from '../../components/Spinner';

class NdlaFilmEditor extends React.Component {
  state = {
    filmFrontpage: undefined,
    slideshowMovies: undefined,
    themes: undefined,
    allMovies: undefined,
    selectedLanguage: this.props.selectedLanguage,
    loading: true,
  };

  async componentDidMount() {
    try {
      const filmFrontpage = await fetchFilmFrontpage();
      const allMovies = await this.fetchAllMovies();
      await this.fetchMovies(filmFrontpage);
      this.setState({
        filmFrontpage,
        allMovies,
        loading: false,
      });
    } catch (err) {
      handleError(err);
    }
  }

  updateFilmFrontpage = async filmFrontpage => {
    await this.fetchMovies(filmFrontpage);
    this.setState({
      filmFrontpage,
    });
  };

  fetchMovies = async filmFrontpage => {
    const { slideShow, movieThemes } = filmFrontpage;
    const slideshowMovies = await this.getSlideshow(slideShow);
    const themes = await this.getThemes(movieThemes);
    this.setState({
      slideshowMovies,
      themes,
    });
  };

  getSlideshow = async slideShowUrnIds => {
    if (slideShowUrnIds.length === 0) return [];
    const slideshowIds = slideShowUrnIds.map(getIdFromUrn);
    const slideshowResult = await this.queryArticles(slideshowIds.join());
    const correctOrderSlideshow = this.sortMoviesByIdList(slideshowIds, slideshowResult);
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
      const sortedMovies = this.sortMoviesByIdList(movieThemeIds, fetchedMovies);
      return { ...movieTheme, movies: sortedMovies };
    }
    return movieTheme;
  };

  sortMoviesByIdList = (idList, movieList) => {
    const { t } = this.props;
    const notFoundMovie = { title: { title: t('ndlaFilm.editor.notFound') } };
    return idList.map(
      id =>
        movieList.find(movie => movie.id.toString() === id) || {
          ...notFoundMovie,
          id: id,
        },
    );
  };

  fetchAllMovies = async () => {
    const query = {
      page: 1,
      subjects: 'urn:subject:20',
      'context-types': config.ndlaFilmArticleType,
      sort: '-relevance',
      'page-size': 10000,
    };
    const response = await searchResources(query);
    return response.results;
  };

  queryArticles = async ids => {
    const query = {
      page: 1,
      'context-types': config.ndlaFilmArticleType,
      sort: '-relevance',
      'page-size': 10,
      ids: ids,
    };
    const response = await searchResources(query);
    return response.results;
  };

  render() {
    const { t, selectedLanguage } = this.props;
    if (selectedLanguage !== this.state.selectedLanguage) {
      this.setState({
        selectedLanguage: selectedLanguage,
      });
    }
    const { allMovies, loading, filmFrontpage, slideshowMovies, themes } = this.state;

    if (loading || !filmFrontpage) {
      return <Spinner withWrapper />;
    }

    return (
      <OneColumn>
        <HelmetWithTracker title={t('htmlTitles.ndlaFilmPage')} />
        <NdlaFilmForm
          filmFrontpage={filmFrontpage}
          updateFilmFrontpage={this.updateFilmFrontpage}
          slideshowMovies={slideshowMovies}
          themes={themes}
          selectedLanguage={selectedLanguage}
          allMovies={allMovies}
          loading={loading}
        />
      </OneColumn>
    );
  }
}

NdlaFilmEditor.propTypes = {
  selectedLanguage: PropTypes.string,
};

export default injectT(NdlaFilmEditor);
