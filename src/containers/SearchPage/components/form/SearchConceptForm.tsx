/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@ndla/button';
import { css } from '@emotion/core';
import { RouteComponentProps } from 'react-router-dom';
import { getResourceLanguages } from '../../../../util/resourceHelpers';
import { getTagName } from '../../../../util/formHelper';
import ObjectSelector from '../../../../components/ObjectSelector';
import SearchTagGroup from './SearchTagGroup';
import { searchFormClasses, SearchParams } from './SearchForm';
import * as conceptStatuses from '../../../../util/constants/ConceptStatus';
import { CONCEPT_WRITE_SCOPE } from '../../../../constants';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { MinimalTagType } from './SearchTag';
import { useAuth0Editors } from '../../../../modules/auth0/auth0Queries';

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

  const tagTypes = [
    {
      type: 'query',
      id: search.query!,
      name: search.query,
    },
    {
      type: 'language',
      id: search.language!,
      name: getTagName(search.language, getResourceLanguages(t)),
    },
    {
      type: 'users',
      id: search.users!,
      name: getTagName(search.users, users),
    },
    {
      type: 'subjects',
      id: search.subjects!,
      name: getTagName(search.subjects, subjects),
    },
    {
      type: 'status',
      id: search.status!,
      name: getTagName(search.status, getConceptStatuses()),
    },
  ];

  return (
    <form onSubmit={handleSearch} {...searchFormClasses()}>
      <div {...searchFormClasses('field', '50-width')}>
        <input
          name="query"
          placeholder={t('searchForm.types.conceptQuery')}
          value={queryInput}
          onChange={onInputChange}
        />
      </div>
      <div key={`searchfield_subjects`} {...searchFormClasses('field', `50-width`)}>
        <ObjectSelector
          name={'subjects'}
          options={subjects.sort(sortByProperty('name'))}
          idKey="id"
          value={search.subjects ?? ''}
          labelKey="name"
          emptyField
          placeholder={t(`searchForm.types.subjects`)}
          onChange={onFieldChange}
        />
      </div>
      <div key={`searchfield_status`} {...searchFormClasses('field', `25-width`)}>
        <ObjectSelector
          name={'status'}
          options={getConceptStatuses()}
          idKey="id"
          value={search.status ?? ''}
          labelKey="name"
          emptyField
          placeholder={t(`searchForm.types.status`)}
          onChange={onFieldChange}
        />
      </div>
      <div {...searchFormClasses('field', '25-width')}>
        <ObjectSelector
          name="language"
          value={search.language ?? ''}
          options={getResourceLanguages(t)}
          idKey="id"
          labelKey="name"
          emptyField
          onChange={onFieldChange}
          onBlur={onFieldChange}
          placeholder={t('searchForm.types.language')}
        />
      </div>
      <div {...searchFormClasses('field', '25-width')}>
        <ObjectSelector
          name="users"
          value={search.users ?? ''}
          options={users!.sort(sortByProperty('name'))}
          idKey="id"
          labelKey="name"
          emptyField
          onChange={onFieldChange}
          onBlur={onFieldChange}
          placeholder={t('searchForm.types.users')}
        />
      </div>
      <div {...searchFormClasses('field', '25-width')}>
        <Button
          css={css`
            margin-right: 1%;
            width: 49%;
          `}
          onClick={emptySearch}
          outline>
          {t('searchForm.empty')}
        </Button>
        <Button
          css={css`
            width: 49%;
          `}
          submit>
          {t('searchForm.btn')}
        </Button>
      </div>
      <div {...searchFormClasses('tagline')}>
        <SearchTagGroup onRemoveItem={removeTagItem} tagTypes={tagTypes} />
      </div>
    </form>
  );
};

export default SearchConceptForm;
