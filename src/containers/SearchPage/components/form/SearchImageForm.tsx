/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
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
    doSearch({ query: '', language: '', license: '', 'model-released': '' });
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
      type: 'license',
      id: search.license!,
      name: getTagName(search.license, licenses),
    },
    {
      type: 'modelReleased',
      id: search['model-released']!,
      name: getTagName(search['model-released'], getModelReleasedValues(t)),
    },
  ];

  return (
    <form onSubmit={handleSearch} {...searchFormClasses()}>
      <div {...searchFormClasses('field', '50-width')}>
        <input
          name="query"
          placeholder={t('searchForm.types.imageQuery')}
          value={queryInput}
          onChange={onInputChange}
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
      <div {...searchFormClasses('field', '50-width')}>
        <ObjectSelector
          name="model-released"
          value={search['model-released'] ?? ''}
          options={getModelReleasedValues(t)}
          idKey="id"
          labelKey="name"
          emptyField
          onChange={onFieldChange}
          placeholder={t('searchForm.types.modelReleased')}
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

export default SearchImageForm;
