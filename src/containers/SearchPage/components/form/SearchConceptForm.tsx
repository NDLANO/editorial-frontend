/**
 * Copyright (c) 2019-present, NDLA.
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
import * as conceptStatuses from '../../../../util/constants/ConceptStatus';
import { CONCEPT_WRITE_SCOPE } from '../../../../constants';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { MinimalTagType } from './SearchTag';
import { useAuth0Editors } from '../../../../modules/auth0/auth0Queries';
import GenericSearchForm, { SearchFormSelector } from './GenericSearchForm';

interface Props extends RouteComponentProps {
  search: (o: SearchParams) => void;
  subjects: SubjectType[];
  searchObject: SearchParams;
  locale: string;
}

const SearchConceptForm = ({ search: doSearch, searchObject: search, subjects }: Props) => {
  const { t } = useTranslation();
  const [queryInput, setQueryInput] = useState(search.query ?? '');
  const { data: users } = useAuth0Editors(CONCEPT_WRITE_SCOPE, {
    select: users => users.map(u => ({ id: `${u.app_metadata.ndla_id}`, name: u.name })),
    placeholderData: [],
  });

  const onInputChange = (evt: React.FormEvent<HTMLInputElement>) => {
    setQueryInput(evt.currentTarget.value);
    doSearch({ ...search, query: evt.currentTarget.value });
  };

  const onFieldChange = (evt: React.FormEvent<HTMLSelectElement>) => {
    const { value, name } = evt.currentTarget;
    doSearch({ ...search, [name]: value });
  };

  const getConceptStatuses = () => {
    return Object.keys(conceptStatuses).map(s => {
      return { id: s, name: t(`form.status.${s.toLowerCase()}`) };
    });
  };

  const handleSearch = (evt?: React.SyntheticEvent) => {
    evt?.preventDefault();
    doSearch({ ...search, page: 1 });
  };

  const removeTagItem = (tag: MinimalTagType) => {
    if (tag.type === 'query') setQueryInput('');
    doSearch({ ...search, [tag.type]: '' });
  };

  const emptySearch = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.persist();
    setQueryInput('');
    doSearch({
      query: '',
      language: '',
      'audio-type': '',
      license: '',
      subjects: '',
      users: '',
      status: '',
    });
  };

  const sortByProperty = (property: string) => {
    type Sortable = { [key: string]: any };

    return function(a: Sortable, b: Sortable) {
      return a[property]?.localeCompare(b[property]);
    };
  };

  const selectors: SearchFormSelector[] = [
    {
      type: 'subjects',
      name: getTagName(search.subjects, subjects),
      options: subjects.sort(sortByProperty('name')),
    },
    {
      type: 'status',
      name: getTagName(search.status, getConceptStatuses()),
      options: getConceptStatuses(),
      width: 25,
    },
    {
      type: 'language',
      name: getTagName(search.language, getResourceLanguages(t)),
      options: getResourceLanguages(t),
      width: 25,
    },
    {
      type: 'users',
      name: getTagName(search.users, users),
      options: users!.sort(sortByProperty('name')),
      width: 25,
    },
  ];

  return (
    <GenericSearchForm
      type="concept"
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

export default SearchConceptForm;
