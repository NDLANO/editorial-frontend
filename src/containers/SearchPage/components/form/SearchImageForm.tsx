/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import { getResourceLanguages } from '../../../../util/resourceHelpers';
import { getTagName } from '../../../../util/formHelper';
import { getLicensesWithTranslations } from '../../../../util/licenseHelpers';
import { SearchParams } from './SearchForm';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { MinimalTagType } from './SearchTag';
import { useLicenses } from '../../../../modules/draft/draftQueries';
import GenericSearchForm, { SearchFormSelector } from './GenericSearchForm';

interface Props extends RouteComponentProps {
  search: (o: SearchParams) => void;
  subjects: SubjectType[];
  searchObject: SearchParams;
  locale: string;
}

const getModelReleasedValues = (t: TFunction) => [
  { id: 'yes', name: t('imageSearch.modelReleased.yes') },
  { id: 'not-applicable', name: t('imageSearch.modelReleased.not-applicable') },
  { id: 'no', name: t('imageSearch.modelReleased.no') },
  { id: 'not-set', name: t('imageSearch.modelReleased.not-set') },
];

const SearchImageForm = ({
  locale,
  search: doSearch,
  searchObject: search = {
    query: '',
    language: '',
  },
}: Props) => {
  const { t } = useTranslation();
  const [queryInput, setQueryInput] = useState(search.query ?? '');
  const { data: licenses } = useLicenses({
    select: licenses =>
      getLicensesWithTranslations(licenses, locale).map(license => ({
        id: license.license,
        name: license.title,
      })),
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
    doSearch({ query: '', language: '', license: '', 'model-released': '' });
  };

  const selectors: SearchFormSelector[] = [
    {
      type: 'license',
      name: getTagName(search.license, licenses),
      options: licenses ?? [],
    },
    {
      type: 'model-released',
      name: getTagName(search['model-released'], getModelReleasedValues(t)),
      options: getModelReleasedValues(t),
    },
    {
      type: 'language',
      name: getTagName(search.language, getResourceLanguages(t)),
      options: getResourceLanguages(t),
      width: 25,
    },
  ];

  return (
    <GenericSearchForm
      type="image"
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

export default SearchImageForm;
