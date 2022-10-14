/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, useEffect, useState, MouseEvent } from 'react';

import { TFunction, useTranslation } from 'react-i18next';
import { getResourceLanguages } from '../../../../util/resourceHelpers';
import { getTagName } from '../../../../util/formHelper';
import { getLicensesWithTranslations } from '../../../../util/licenseHelpers';
import { SearchParams } from './SearchForm';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { useLicenses } from '../../../../modules/draft/draftQueries';
import GenericSearchForm, { OnFieldChangeFunction, SearchFormSelector } from './GenericSearchForm';
import { TagType } from './SearchTagGroup';

interface Props {
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

  useEffect(() => {
    if (search.query !== queryInput) {
      setQueryInput(search.query ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.query]);

  const onInputChange = (evt: FormEvent<HTMLInputElement>) => {
    setQueryInput(evt.currentTarget.value);
    doSearch({ ...search, query: evt.currentTarget.value });
  };

  const onFieldChange: OnFieldChangeFunction = (name, value) => {
    doSearch({ ...search, [name]: value });
  };

  const handleSearch = () => doSearch({ ...search, page: 1 });

  const removeTagItem = (tag: TagType) => {
    if (tag.parameterName === 'query') setQueryInput('');
    doSearch({ ...search, [tag.parameterName]: '' });
  };

  const emptySearch = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.persist();
    setQueryInput('');
    doSearch({ query: '', language: '', license: '', 'model-released': '' });
  };

  const selectors: SearchFormSelector[] = [
    {
      parameterName: 'license',
      value: getTagName(search.license, licenses),
      options: licenses ?? [],
      formElementType: 'dropdown',
    },
    {
      parameterName: 'model-released',
      value: getTagName(search['model-released'], getModelReleasedValues(t)),
      options: getModelReleasedValues(t),
      formElementType: 'dropdown',
    },
    {
      parameterName: 'language',
      value: getTagName(search.language, getResourceLanguages(t)),
      options: getResourceLanguages(t),
      width: 25,
      formElementType: 'dropdown',
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
