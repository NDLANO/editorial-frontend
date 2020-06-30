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

const DropdownSearch = ({
  selectedElements,
  placeholder,
  onChange,
  subjectId,
}) => {
  const queryResources = async input => {
    let query = {
      page: 1,
      subjects: `urn:subject:${subjectId || '20'}`,
      sort: '-relevance',
      'page-size': 10,
      query: input,
    };
    subjectId
      ? (query = { ...query })
      : (query = {
          ...query,
          'context-types': config.ndlaFilmArticleType,
        });
    const response = await searchResources(query);
    return response.results.map(result => ({
      ...result,
      title: result.title ? result.title.title : '',
    }));
  };

  return (
    <AsyncDropdown
      idField="id"
      onChange={element => {
        onChange(element);
      }}
      apiAction={input => queryResources(input)}
      selectedItems={selectedElements.map(element => ({
        ...element,
        title: element.title ? element.title.title : '',
      }))}
      multiSelect
      placeholder={placeholder}
      labelField="title"
      disableSelected
    />
  );
};

DropdownSearch.propTypes = {
  selectedElements: PropTypes.arrayOf(ContentResultShape),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  subjectId: PropTypes.string,
};

export default DropdownSearch;
