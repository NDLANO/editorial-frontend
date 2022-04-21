/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { flattenResourceTypesAndAddContextTypes } from '../../../../util/taxonomyHelpers';
import { getResourceLanguages } from '../../../../util/resourceHelpers';
import { getTagName } from '../../../../util/formHelper';
import ArticleStatuses from '../../../../util/constants/index';
import { SearchParams } from './SearchForm';
import { DRAFT_WRITE_SCOPE } from '../../../../constants';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { MinimalTagType } from './SearchTag';
import { useAuth0Editors } from '../../../../modules/auth0/auth0Queries';
import { useAllResourceTypes } from '../../../../modules/taxonomy/resourcetypes/resourceTypesQueries';
import GenericSearchForm, { SearchFormSelector } from './GenericSearchForm';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';

interface Props {
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

const SearchContentForm = ({ search: doSearch, searchObject: search, subjects, locale }: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [queryInput, setQueryInput] = useState(search.query ?? '');
  const [isHasPublished, setIsHasPublished] = useState(false);

  const { data: users } = useAuth0Editors(
    { permission: DRAFT_WRITE_SCOPE },
    {
      select: users => users.map(u => ({ id: `${u.app_metadata.ndla_id}`, name: u.name })),
      placeholderData: [],
    },
  );

  const { data: resourceTypes } = useAllResourceTypes(
    { language: locale, taxonomyVersion },
    {
      select: resourceTypes => flattenResourceTypesAndAddContextTypes(resourceTypes, t),
      placeholderData: [],
    },
  );

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

  const onFieldChange = (name: string, value: string) => {
    let includeOtherStatuses: boolean | undefined;
    let status: string | undefined;
    if (name === 'draft-status') {
      const isHasPublished = value === 'HAS_PUBLISHED';
      includeOtherStatuses = isHasPublished;
      setIsHasPublished(isHasPublished);
      status = isHasPublished ? 'PUBLISHED' : value;
    } else {
      includeOtherStatuses = search['include-other-statuses'];
      status = search.status;
    }

    const searchObj = { ...search, 'include-other-statuses': includeOtherStatuses, [name]: value };
    doSearch(
      name !== 'draft-status'
        ? searchObj
        : { ...searchObj, 'draft-status': status, fallback: false },
    );
  };

  const handleSearch = () => doSearch({ ...search, fallback: false, page: 1 });

  const removeTagItem = (tag: MinimalTagType) => {
    if (tag.type === 'query') setQueryInput('');
    if (tag.type === 'draft-status') setIsHasPublished(tag.name === 'HAS_PUBLISHED');
    doSearch({ ...search, [tag.type]: '' });
  };

  const emptySearch = () => {
    setIsHasPublished(false);
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

  const selectors: SearchFormSelector[] = [
    {
      name: getTagName(search.subjects, subjects),
      type: 'subjects',
      width: 50,
      options: subjects.sort(sortByProperty('name')),
    },
    {
      name: getTagName(search['resource-types'], resourceTypes),
      type: 'resource-types',
      width: 25,
      options: resourceTypes!.sort(sortByProperty('name')),
    },
    {
      name: getTagName(
        isHasPublished ? 'HAS_PUBLISHED' : search['draft-status'],
        getDraftStatuses(),
      ),
      type: 'draft-status',
      width: 25,
      options: getDraftStatuses().sort(sortByProperty('name')),
    },
    {
      name: getTagName(search.users, users),
      type: 'users',
      width: 50,
      options: users!.sort(sortByProperty('name')),
    },
    {
      name: getTagName(search.language, getResourceLanguages(t)),
      type: 'language',
      width: 25,
      options: getResourceLanguages(t),
    },
    {
      name: search['revision-date-from'],
      type: 'revision-date-from',
      width: 25,
      options: [],
    },
    {
      name: search['revision-date-to'],
      type: 'revision-date-to',
      width: 25,
      options: [],
    },
  ];

  return (
    <GenericSearchForm
      type="content"
      selectors={selectors}
      query={queryInput}
      onQueryChange={onInputChange}
      onSubmit={handleSearch}
      searchObject={{
        ...search,
        'draft-status': isHasPublished ? 'HAS_PUBLISHED' : search['draft-status'],
      }}
      onFieldChange={onFieldChange}
      emptySearch={emptySearch}
      removeTag={removeTagItem}
    />
  );
};

export default SearchContentForm;
