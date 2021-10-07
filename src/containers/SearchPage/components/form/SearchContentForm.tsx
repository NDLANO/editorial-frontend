/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FormEvent, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/core';
import Button from '@ndla/button';
import { RouteComponentProps } from 'react-router-dom';
import { flattenResourceTypesAndAddContextTypes } from '../../../../util/taxonomyHelpers';
import { getResourceLanguages } from '../../../../util/resourceHelpers';
import { getTagName } from '../../../../util/formHelper';
import ObjectSelector from '../../../../components/ObjectSelector';
import SearchTagGroup from './SearchTagGroup';
import ArticleStatuses from '../../../../util/constants/index';
import { searchFormClasses, SearchParams } from './SearchForm';
import { CONCEPT_WRITE_SCOPE } from '../../../../constants';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { MinimalTagType } from './SearchTag';
import { useAuth0Editors } from '../../../../modules/auth0/auth0Queries';
import { useAllResourceTypes } from '../../../../modules/taxonomy/resourcetypes/resourceTypesQueries';

interface Props extends RouteComponentProps {
  search: (o: SearchParams) => void;
  subjects: SubjectType[];
  searchObject: SearchParams;
  locale: string;
}

export interface SearchState extends Record<string, string> {
  subjects: string;
  resourceTypes: string;
  status: string;
  query: string;
  users: string;
  language: string;
}

interface SelectFieldsType {
  name: keyof SearchParams;
  label: string;
  width: number;
  options: any;
}

const SearchContentForm = ({ search: doSearch, searchObject: search, subjects, locale }: Props) => {
  const { t } = useTranslation();
  const [queryInput, setQueryInput] = useState(search.query ?? '');

  const { data: users } = useAuth0Editors(CONCEPT_WRITE_SCOPE, {
    select: users => users.map(u => ({ id: `${u.app_metadata.ndla_id}`, name: u.name })),
    placeholderData: [],
  });

  const { data: resourceTypes } = useAllResourceTypes(locale, {
    select: resourceTypes => flattenResourceTypesAndAddContextTypes(resourceTypes, t),
    placeholderData: [],
  });

  const onInputChange = (evt: React.FormEvent<HTMLInputElement>) => {
    setQueryInput(evt.currentTarget.value);
    doSearch({ ...search, query: evt.currentTarget.value });
  };

  const onFieldChange = (evt: FormEvent<HTMLSelectElement>) => {
    const { name, value } = evt.currentTarget;
    const includeOtherStatuses =
      name === 'status' ? value === 'HAS_PUBLISHED' : search['include-other-statuses'];
    doSearch({ ...search, 'include-other-statuses': includeOtherStatuses, [name]: value });
  };

  const handleSearch = () => {
    // HAS_PUBLISHED isn't a status in the backend.
    const newStatus = search.status === 'HAS_PUBLISHED' ? 'PUBLISHED' : search.status;
    doSearch({ ...search, 'draft-status': newStatus, fallback: false, page: 1 });
  };

  const removeTagItem = (tag: MinimalTagType) => {
    if (tag.type === 'query') setQueryInput('');
    doSearch({ ...search, [tag.type]: '' });
  };

  const emptySearch = () => {
    setQueryInput('');
    doSearch({
      query: '',
      subjects: '',
      'resource-types': '',
      status: '',
      users: '',
      language: '',
    });
  };

  const getDraftStatuses = (): { id: string; name: string }[] => {
    return [
      ...Object.keys(ArticleStatuses.articleStatuses).map(s => {
        return { id: s, name: t(`form.status.${s.toLowerCase()}`) };
      }),
      { id: 'HAS_PUBLISHED', name: t(`form.status.has_published`) },
    ];
  };

  const sortByProperty = (property: string) => {
    type Sortable = { [key: string]: any };
    return (a: Sortable, b: Sortable) => a[property]?.localeCompare(b[property]);
  };

  const selectFields: SelectFieldsType[] = [
    {
      name: 'subjects',
      label: 'subjects',
      width: 25,
      options: subjects.sort(sortByProperty('name')),
    },
    {
      name: 'resource-types',
      label: 'resourceTypes',
      width: 25,
      options: resourceTypes!.sort(sortByProperty('name')),
    },
    {
      name: 'status',
      label: 'status',
      width: 25,
      options: getDraftStatuses().sort(sortByProperty('name')),
    },
    {
      name: 'users',
      label: 'users',
      width: 25,
      options: users!.sort(sortByProperty('name')),
    },
    {
      name: 'language',
      label: 'language',
      width: 25,
      options: getResourceLanguages(t),
    },
  ];

  const tagTypes = [
    {
      type: 'query',
      id: search.query!,
      name: search.query,
    },
    ...selectFields.map(field => ({
      type: field.label,
      id: `${search[field.name]}`,
      name: getTagName(search[field.name], field.options),
    })),
  ];

  return (
    <Fragment>
      <form
        onSubmit={evt => {
          evt.preventDefault();
          handleSearch();
        }}
        {...searchFormClasses()}>
        <div {...searchFormClasses('field', '50-width')}>
          <input
            name="query"
            value={queryInput}
            placeholder={t('searchForm.types.contentQuery')}
            onChange={onInputChange}
          />
        </div>

        {selectFields.map(selectField => (
          <div
            key={`searchfield_${selectField.name}`}
            {...searchFormClasses('field', `${selectField.width}-width`)}>
            <ObjectSelector
              name={selectField.name}
              options={selectField.options}
              idKey="id"
              // The fields in selectFields that are mapped over all correspond to a string value in SearchState.
              // As such, the value used below will always be a string. TypeScript just needs to be told explicitly.
              value={search[selectField.name] as string}
              labelKey="name"
              emptyField
              placeholder={t(`searchForm.types.${selectField.label}`)}
              onChange={onFieldChange}
            />
          </div>
        ))}
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
    </Fragment>
  );
};

export default SearchContentForm;
