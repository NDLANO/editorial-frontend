/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { AsyncDropdown } from '../../../components/Dropdown';
import { searchResources } from '../../../modules/search/searchApi';
import {
  MultiSearchApiQuery,
  MultiSearchSummary,
} from '../../../modules/search/searchApiInterfaces';

const DropdownSearch = ({
  selectedElements,
  placeholder,
  onChange,
  subjectId,
  contextTypes,
  clearInputField,
  onClick,
}: Props) => {
  const queryResources = async (input: string | undefined) => {
    const query: MultiSearchApiQuery = {
      page: 1,
      subjects: subjectId,
      sort: '-relevance',
      'page-size': 10,
      query: input,
      'context-types': contextTypes,
    };
    const response = await searchResources(query);
    return response.results.map(result => ({
      ...result,
      title: result.title ? result.title.title : '',
    }));
  };

  return (
    <AsyncDropdown
      idField="id"
      onChange={(element: MultiSearchSummary) => {
        onChange(element);
      }}
      apiAction={(input: string | undefined) => queryResources(input)}
      selectedItems={selectedElements.map(element => ({
        ...element,
        title: element.title ? element.title.title : '',
      }))}
      multiSelect
      placeholder={placeholder}
      labelField="title"
      disableSelected
      clearInputField={clearInputField}
      onClick={onClick}
    />
  );
};

interface Props {
  selectedElements: any[];
  onChange: (element: MultiSearchSummary) => void;
  placeholder: string;
  subjectId: string;
  contextTypes?: string;
  clearInputField: boolean;
  onClick?: (event: Event) => void;
}

export default DropdownSearch;
