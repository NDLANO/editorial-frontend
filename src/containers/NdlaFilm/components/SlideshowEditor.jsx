/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { FieldHeader, Select } from '@ndla/forms';
import { Spinner } from '@ndla/editor';
import MovieList from './MovieList';
import AddMovieOptions from './AddMovieOptions';
import { ContentResultShape } from '../../../shapes';

const SlideshowEditor = ({
  t,
  slideshowMovies,
  allMovies,
  saveSlideshow,
  onAddMovieToSlideshow,
}) => {
  if (!slideshowMovies) {
    return <Spinner />;
  }

  return (
    <>
      <FieldHeader
        title={t('ndlaFilm.editor.slideshowTitle')}
        subTitle={t('ndlaFilm.editor.slideshowSubTitle')}
      />
      <MovieList
        movies={slideshowMovies}
        data-cy="slideshow-movie-list"
        messages={{
          dragFilm: t('ndlaFilm.editor.changeOrder'),
          removeFilm: t('ndlaFilm.editor.removeMovieFromSlideshow'),
        }}
        onUpdateMovies={saveSlideshow}
      />
      <Select
        data-cy="add-slideshow-movie"
        value=""
        onChange={e => onAddMovieToSlideshow(e.target.value)}>
        <option value="">{t('ndlaFilm.editor.addMovieToSlideshow')}</option>
        <AddMovieOptions addedMovies={slideshowMovies} allMovies={allMovies} />
      </Select>
    </>
  );
};

SlideshowEditor.propTypes = {
  slideshowMovies: PropTypes.arrayOf(ContentResultShape),
  allMovies: PropTypes.arrayOf(ContentResultShape),
  saveSlideshow: PropTypes.func.isRequired,
  onAddMovieToSlideshow: PropTypes.func.isRequired,
};

export default injectT(SlideshowEditor);
