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

class SlideshowEditor extends React.Component {
  render() {
    const {
      t,
      slideshowmovies,
      saveSlideshow,
      onAddMovieToSlideshow,
      renderAddMovieOptions,
    } = this.props;

    if (!slideshowmovies) {
      return <Spinner />;
    }

    return (
      <>
        <FieldHeader
          title={t('ndlaFilm.editor.slideshowTitle')}
          subTitle={t('ndlaFilm.editor.slideshowSubTitle')}
        />
        <MovieList
          id="slideshowId"
          movies={slideshowmovies}
          messages={{
            dragFilm: t('ndlaFilm.editor.changeOrder'),
            removeFilm: t('ndlaFilm.editor.removeMovieFromSlideshow'),
          }}
          onUpdateMovies={updates => {
            saveSlideshow(updates);
          }}
        />
        <Select value="" onChange={e => onAddMovieToSlideshow(e.target.value)}>
          <option value="">{t('ndlaFilm.editor.addMovieToSlideshow')}</option>
          {renderAddMovieOptions(slideshowmovies)}
        </Select>
      </>
    );
  }
}

SlideshowEditor.propTypes = {
  slideshowmovies: PropTypes.arrayOf(PropTypes.shape),
  saveSlideshow: PropTypes.func,
  onAddMovieToSlideshow: PropTypes.func,
  renderAddMovieOptions: PropTypes.func,
};

export default injectT(SlideshowEditor);
