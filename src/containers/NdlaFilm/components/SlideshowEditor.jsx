/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';
import { Spinner } from '@ndla/editor';
import ElementList from './ElementList';
import DropdownSearch from './DropdownSearch';
import { ContentResultShape } from '../../../shapes';

const SlideshowEditor = ({
  t,
  slideshowMovies,
  saveSlideshow,
  onAddMovieToSlideshow,
  loading,
}) => {
  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <FieldHeader
        title={t('ndlaFilm.editor.slideshowTitle')}
        subTitle={t('ndlaFilm.editor.slideshowSubTitle')}
      />
      <ElementList
        elements={slideshowMovies}
        data-cy="slideshow-movie-list"
        messages={{
          dragElements: t('ndlaFilm.editor.changeOrder'),
          removeElements: t('ndlaFilm.editor.removeMovieFromSlideshow'),
        }}
        onUpdateElements={saveSlideshow}
      />
      <DropdownSearch
        selectedElements={slideshowMovies}
        onChange={onAddMovieToSlideshow}
        placeholder={t('ndlaFilm.editor.addMovieToSlideshow')}
      />
    </>
  );
};

SlideshowEditor.propTypes = {
  slideshowMovies: PropTypes.arrayOf(ContentResultShape),
  allMovies: PropTypes.arrayOf(ContentResultShape),
  saveSlideshow: PropTypes.func.isRequired,
  onAddMovieToSlideshow: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default injectT(SlideshowEditor);
