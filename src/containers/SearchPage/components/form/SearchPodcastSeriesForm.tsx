/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import { getResourceLanguages } from '../../../../util/resourceHelpers';
import { getTagName } from '../../../../util/formHelper';
import { SearchParams } from './SearchForm';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { MinimalTagType } from './SearchTag';
import GenericSearchForm, { SearchFormSelector } from './GenericSearchForm';

interface Props extends RouteComponentProps {
  search: (o: SearchParams) => void;
  subjects: SubjectType[];
  searchObject: SearchParams;
  locale: string;
}

const SearchAudioForm = ({
  search: doSearch,
  searchObject: search = {
    query: '',
    language: '',
    'audio-type': '',
  },
}: Props) => {
  const { t } = useTranslation();
  const [queryInput, setQueryInput] = useState(search.query ?? '');

  const onInputChange = (evt: React.FormEvent<HTMLInputElement>) => {
    setQueryInput(evt.currentTarget.value);
    doSearch({ ...search, query: evt.currentTarget.value });
  };

  const onFieldChange = (evt: React.FormEvent<HTMLSelectElement>) => {
    const { value, name } = evt.currentTarget;
    doSearch({ ...search, [name]: value });
  };

  const handleSearch = () => doSearch({ ...search, page: 1 });

  const removeTagItem = (tag: MinimalTagType) => {
    if (tag.type === 'query') setQueryInput('');
    doSearch({ ...search, [tag.type]: '' });
  };

  const emptySearch = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.persist();
    setQueryInput('');
    doSearch({ query: '', language: '' });
  };

  const selectors: SearchFormSelector[] = [
    {
      type: 'language',
      name: getTagName(search.language, getResourceLanguages(t)),
      options: getResourceLanguages(t),
      width: 25,
    },
  ];

  return (
    <GenericSearchForm
      type="podcastSeries"
      selectors={selectors}
      query={queryInput}
      onQueryChange={onInputChange}
      onSubmit={handleSearch}
      searchObject={search}
      onFieldChange={onFieldChange}
      emptySearch={emptySearch}
      removeTag={removeTagItem}
    />
  );
};

export default SearchAudioForm;
