/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import { injectT, tType } from '@ndla/i18n';
import SearchTag, { TagType } from './SearchTag';
import { SearchParams } from './SearchForm';
import { ResourceType, SearchState, User } from './SearchContentForm';
import { SubjectType } from '../../../../interfaces';

// TODO: slutt med any i denne
const findTagName = (array: any, value: any, arrayKey: any = undefined) => {
  if (!array || array.length === 0) {
    return undefined;
  }
  const result = array.find(
    (arrayElement: any) => (arrayKey ? arrayElement[arrayKey] : arrayElement) === value,
  );
  return result && result.name ? result.name : undefined;
};

interface Props {
  searchObject: SearchState;
  onRemoveItem: (tag: TagType) => void;
  languages: (tFunc: tType['t']) => void;
  resourceTypes?: ResourceType[];
  users: User[];
  status: { id: string; name: string }[];
  subjects: SubjectType[];
}

const SearchTagGroup = ({
  subjects,
  resourceTypes,
  status,
  searchObject,
  users,
  languages,
  t,
  onRemoveItem,
}: Props & tType) => {
  const tagTypes = [
    { type: 'query', id: searchObject.query, name: searchObject.query },
    {
      type: 'language',
      id: searchObject.language,
      name: findTagName(languages(t), searchObject.language, 'id'),
    },
    {
      type: 'users',
      id: searchObject.users,
      name: findTagName(users, searchObject.users, 'id'),
    },
    {
      type: 'subjects',
      id: searchObject.subjects,
      name: findTagName(subjects, searchObject.subjects, 'id'),
    },
    {
      type: 'resourceTypes',
      id: searchObject.resourceTypes,
      name: findTagName(resourceTypes, searchObject.resourceTypes, 'id'),
    },
    {
      type: 'status',
      id: searchObject.status,
      name: findTagName(status, searchObject.status, 'id'),
    },
  ];

  return (
    <Fragment>
      {tagTypes.map(tag => {
        if (!tag.name) return null;
        return <SearchTag key={`searchtag_${tag.type}`} onRemoveItem={onRemoveItem} tag={tag} />;
      })}
    </Fragment>
  );
};

export default injectT(SearchTagGroup);
