/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { ContentResultShape } from '../../../shapes';
import { AsyncDropdown } from '../../../components/Dropdown';
import { searchResources } from '../../../modules/search/searchApi';
import config from '../../../config';

const queryResources = async input => {
  const contextType =
    config.ndlaEnvironment === 'ff' ? 'standard' : 'topic-article';
  const query = {
    page: 1,
    subjects: 'urn:subject:20',
    'context-types': contextType,
    sort: '-relevance',
    'page-size': 10,
    query: input,
  };
  const response = await searchResources(query);
  return response.results.map(result => ({
    ...result,
    title: result.title ? result.title.title : '',
  }));
};

const DropdownSearch = ({ selectedMovies, placeholder, onChange }) => (
  <AsyncDropdown
    idField="id"
    onChange={movie => onChange(movie)}
    apiAction={input => queryResources(input)}
    selectedItems={selectedMovies.map(movie => ({
      ...movie,
      title: movie.title ? movie.title.title : '',
    }))}
    multiSelect
    placeholder={placeholder}
    labelField="title"
    disableSelected
  />
);

DropdownSearch.propTypes = {
  selectedMovies: PropTypes.arrayOf(ContentResultShape),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
};

export default DropdownSearch;
