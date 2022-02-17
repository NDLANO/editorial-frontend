/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import PropTypes from 'prop-types';
import { IMultiSearchSummary } from "@ndla/types-search-api";
import AsyncDropdown from '../../../components/Dropdown/asyncDropdown/AsyncDropdown';
import { ContentResultShape } from '../../../shapes';
import { searchResources } from '../../../modules/search/searchApi';

interface Props {
  selectedElements: IMultiSearchSummary[];
  onChange: Function;
  placeholder: string;
  subjectId?: string;
  contextTypes?: string;
  clearInputField?: boolean;
  onClick?: (event: Event) => void;
}

const DropdownSearch = ({
  selectedElements,
  placeholder,
  onChange,
  subjectId,
  contextTypes,
  clearInputField,
  onClick,
}: Props) => {
  const queryResources = async (input: string) => {
    const query = {
      page: 1,
      subjects: subjectId,
      sort: '-relevance',
      'page-size': 10,
      query: input,
      'context-types': contextTypes,
      'resoure-types':
        'urn:resourcetype:documentary,urn:resourcetype:featureFilm,urn:resourcetype:series,urn:resourcetype:shortFilm',
    };
    const response = await searchResources(query);
    return response;
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
      clearInputField={clearInputField}
      onClick={onClick}
    />
  );
};

DropdownSearch.propTypes = {
  selectedElements: PropTypes.arrayOf(ContentResultShape),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  subjectId: PropTypes.string,
  contextTypes: PropTypes.string,
  clearInputField: PropTypes.bool,
  onClick: PropTypes.func,
};

export default DropdownSearch;
