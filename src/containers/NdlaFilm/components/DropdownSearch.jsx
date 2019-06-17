/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
//import { Select } from '@ndla/forms';
//import AddMovieOptions from './AddMovieOptions';
import { ContentResultShape } from '../../../shapes';
import { AsyncDropdown } from '../../../components/Dropdown';
import { searchResources } from '../../../modules/search/searchApi';

const DropdownSearch = ({
  t,
  slideshowMovies,
  allMovies,
  onAddMovieToSlideshow,
}) => {
  return (
    <>
      {/* 
      <Select
        data-cy="add-slideshow-movie"
        value=""
        onChange={e => onAddMovieToSlideshow(e.target.value)}>
        <option value="">{t('ndlaFilm.editor.addMovieToSlideshow')}</option>
        <AddMovieOptions addedMovies={slideshowMovies} allMovies={allMovies} />
      </Select>*/}
      <AsyncDropdown
        valueField="id"
        onChange={movie => onAddMovieToSlideshow(movie.id)}
        apiAction={input => queryThing(input)}
        placeholder={t('ndlaFilm.editor.addMovieToSlideshow')}
        textField="title.title"
      />
    </>
  );
};

const queryThing = async input => {
  const query = {
    page: 1,
    subjects: 'urn:subject:20',
    'context-types': 'topic-article',
    sort: '-relevance',
    'page-size': 10,
    query: input,
  };
  const response = await searchResources(query);
  return response.results.map(current => ({
    ...current,
    title: current.title ? current.title.title : '',
  }));
};

DropdownSearch.propTypes = {
  slideshowMovies: PropTypes.arrayOf(ContentResultShape),
  allMovies: PropTypes.arrayOf(ContentResultShape),
  onAddMovieToSlideshow: PropTypes.func.isRequired,
};

export default injectT(DropdownSearch);
