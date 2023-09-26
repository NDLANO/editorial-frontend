/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState, MouseEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import sortBy from 'lodash/sortBy';
import { Node } from '@ndla/types-taxonomy';
import { getResourceLanguages } from '../../../../util/resourceHelpers';
import { getTagName } from '../../../../util/formHelper';
import { SearchParams } from './SearchForm';
import {
  CONCEPT_RESPONSIBLE,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
} from '../../../../constants';
import { useAuth0Editors, useAuth0Responsibles } from '../../../../modules/auth0/auth0Queries';
import { useConceptStateMachine } from '../../../../modules/concept/conceptQueries';
import GenericSearchForm, { OnFieldChangeFunction } from './GenericSearchForm';
import { SearchFormSelector } from './Selector';

interface Props {
  search: (o: SearchParams) => void;
  subjects: Node[];
  searchObject: SearchParams;
  locale: string;
}

const SearchConceptForm = ({ search: doSearch, searchObject: search, subjects }: Props) => {
  const { t } = useTranslation();
  const [queryInput, setQueryInput] = useState(search.query ?? '');
  const { data: users } = useAuth0Editors({
    select: (users) => users.map((u) => ({ id: `${u.app_metadata.ndla_id}`, name: u.name })),
    placeholderData: [],
  });

  const { data: responsibles } = useAuth0Responsibles(
    { permission: CONCEPT_RESPONSIBLE },
    {
      select: (users) =>
        sortBy(
          users.map((u) => ({
            id: `${u.app_metadata.ndla_id}`,
            name: u.name,
          })),
          (u) => u.name,
        ),
      placeholderData: [],
    },
  );

  const onFieldChange: OnFieldChangeFunction = (name, value, evt) => {
    if (name === 'query' && evt) setQueryInput(evt.currentTarget.value);
    else doSearch({ ...search, [name]: value });
  };

  useEffect(() => {
    if (search.query !== queryInput) {
      setQueryInput(search.query ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.query]);

  const { data: statuses } = useConceptStateMachine();

  const getConceptStatuses = () => {
    return Object.keys(statuses || []).map((s) => {
      return { id: s, name: t(`form.status.${s.toLowerCase()}`) };
    });
  };

  const handleSearch = () => doSearch({ ...search, page: 1, query: queryInput });

  const removeTagItem = (tag: SearchFormSelector) => {
    if (tag.parameterName === 'query') setQueryInput('');
    doSearch({ ...search, [tag.parameterName]: '' });
  };

  const conceptTypes = useMemo(
    () => [
      { id: 'concept', name: t('searchForm.conceptType.concept') },
      { id: 'gloss', name: t('searchForm.conceptType.gloss') },
    ],
    [t],
  );

  const emptySearch = (evt: MouseEvent<HTMLButtonElement>) => {
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
      'concept-type': '',
    });
  };

  const sortByProperty = (property: string) => {
    type Sortable = { [key: string]: any };

    return function (a: Sortable, b: Sortable) {
      return a[property]?.localeCompare(b[property]);
    };
  };

  const selectors: SearchFormSelector[] = [
    {
      parameterName: 'concept-type',
      value: getTagName(search['concept-type'], conceptTypes),
      options: conceptTypes,
      formElementType: 'dropdown',
      width: 25,
    },
    {
      parameterName: 'subjects',
      value: getTagName(search.subjects, subjects),
      options: subjects
        .filter(
          (s) => s.metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT] === 'true',
        )
        .sort(sortByProperty('name')),
      formElementType: 'dropdown',
      width: 25,
    },
    {
      value: getTagName(search['responsible-ids'], responsibles),
      parameterName: 'responsible-ids',
      width: 25,
      options: responsibles!,
      formElementType: 'dropdown',
    },
    {
      parameterName: 'status',
      value: getTagName(search.status, getConceptStatuses()),
      options: getConceptStatuses(),
      width: 25,
      formElementType: 'dropdown',
    },
    {
      parameterName: 'language',
      value: getTagName(search.language, getResourceLanguages(t)),
      options: getResourceLanguages(t),
      width: 25,
      formElementType: 'dropdown',
    },
    {
      parameterName: 'users',
      value: getTagName(search.users, users),
      options: users!.sort(sortByProperty('name')),
      width: 25,
      formElementType: 'dropdown',
    },
  ];

  return (
    <GenericSearchForm
      type="concept"
      selectors={selectors}
      query={queryInput}
      onSubmit={handleSearch}
      searchObject={search}
      onFieldChange={onFieldChange}
      emptySearch={emptySearch}
      removeTag={removeTagItem}
    />
  );
};

export default SearchConceptForm;
