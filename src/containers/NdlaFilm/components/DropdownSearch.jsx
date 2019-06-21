/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { ContentResultShape } from '../../../shapes';
import { AsyncDropdown } from '../../../components/Dropdown';
import { searchResources } from '../../../modules/search/searchApi';

const DropdownSearch = ({ t, selectedMovies, placeholder, onChange }) => {
  return (
    <>
      <AsyncDropdown
        valueField="id"
        onChange={movie => onChange(movie)}
        apiAction={input => queryThing(input)}
        selectedItems={selectedMovies.map(movie => movie.title.title)}
        multiSelect
        placeholder={placeholder}
        textField="title.title"
        disableSelected
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
  selectedMovies: PropTypes.arrayOf(ContentResultShape),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
};

export default injectT(DropdownSearch);
