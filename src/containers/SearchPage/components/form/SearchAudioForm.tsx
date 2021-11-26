/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, useEffect, useState, MouseEvent } from 'react';

import { useTranslation } from 'react-i18next';
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

const SearchAudioForm = ({
  locale,
  search: doSearch,
  searchObject: search = {
    query: '',
    language: '',
    'audio-type': '',
  },
}: Props) => {
  const [queryInput, setQueryInput] = useState(search.query ?? '');
  const { t } = useTranslation();
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
    evt.preventDefault();
    evt.stopPropagation();
    setQueryInput(evt.currentTarget.value);
    doSearch({ ...search, query: evt.currentTarget.value });
  };

  const onFieldChange = (evt: FormEvent<HTMLSelectElement>) => {
    const { value, name } = evt.currentTarget;
    doSearch({ ...search, [name]: value });
  };

  const handleSearch = () => doSearch({ ...search, page: 1 });

  const removeTagItem = (tag: MinimalTagType) => {
    if (tag.type === 'query') setQueryInput('');
    doSearch({ ...search, [tag.type]: '' });
  };

  const emptySearch = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.persist();
    setQueryInput('');
    doSearch({ query: '', language: '', 'audio-type': '', license: '' });
  };

  const getAudioTypes = () => [
    { id: 'standard', name: t('searchForm.audioType.standard') },
    { id: 'podcast', name: t('searchForm.audioType.podcast') },
  ];

  const selectors: SearchFormSelector[] = [
    {
      type: 'audio-type',
      name: getTagName(search['audio-type'], getAudioTypes()),
      options: getAudioTypes(),
    },
    {
      type: 'license',
      name: getTagName(search.license, licenses),
      options: licenses ?? [],
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
      type="audio"
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
