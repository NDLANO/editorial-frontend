/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@ndla/button';
import { css } from '@emotion/core';
import { RouteComponentProps } from 'react-router-dom';
import { getResourceLanguages } from '../../../../util/resourceHelpers';
import { getTagName } from '../../../../util/formHelper';
import { getLicensesWithTranslations } from '../../../../util/licenseHelpers';
import ObjectSelector from '../../../../components/ObjectSelector';
import SearchTagGroup from './SearchTagGroup';
import { searchFormClasses, SearchParams } from './SearchForm';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { MinimalTagType } from './SearchTag';
import { useLicenses } from '../../../../modules/draft/draftQueries';

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
    if (search?.query !== '' && search?.query !== undefined && search?.query !== queryInput) {
      setQueryInput(search?.query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, search?.query]);

  const onInputChange = (evt: React.FormEvent<HTMLInputElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
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
    doSearch({ query: '', language: '', 'audio-type': '', license: '' });
  };

  const getAudioTypes = () => [
    { id: 'standard', name: t('searchForm.audioType.standard') },
    { id: 'podcast', name: t('searchForm.audioType.podcast') },
  ];

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
      type: 'audioType',
      id: search['audio-type']!,
      name: getTagName(search['audio-type'], getAudioTypes()),
    },
    {
      type: 'license',
      id: search.license!,
      name: getTagName(search.license, licenses),
    },
  ];

  return (
    <form onSubmit={handleSearch} {...searchFormClasses()}>
      <div {...searchFormClasses('field', '50-width')}>
        <input
          name="query"
          placeholder={t('searchForm.types.audioQuery')}
          value={queryInput}
          onChange={onInputChange}
        />
      </div>
      <div {...searchFormClasses('field', '50-width')}>
        <ObjectSelector
          name="audio-type"
          value={search['audio-type'] ?? ''}
          options={getAudioTypes()}
          idKey="id"
          labelKey="name"
          emptyField
          onChange={onFieldChange}
          placeholder={t('searchForm.types.audio')}
        />
      </div>
      <div {...searchFormClasses('field', '50-width')}>
        <ObjectSelector
          name="license"
          value={search.license ?? ''}
          options={licenses!}
          idKey="id"
          labelKey="name"
          emptyField
          onChange={onFieldChange}
          placeholder={t('searchForm.types.license')}
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
          placeholder={t('searchForm.types.language')}
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

export default SearchAudioForm;
