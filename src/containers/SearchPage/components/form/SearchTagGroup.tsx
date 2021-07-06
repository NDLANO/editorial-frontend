/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import { injectT, tType } from '@ndla/i18n';
import SearchTag, { MinimalTagType } from './SearchTag';
import { User } from './SearchContentForm';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { FlattenedResourceType } from '../../../../interfaces';

interface NameAndId {
  id: string;
  name: string;
}

interface TagType {
  type: string;
  id: string | undefined;
  name: string | undefined;
}

function findTagNameWithId(
  array: NameAndId[] | undefined,
  id: string | undefined,
): string | undefined {
  if (array === undefined || array.length === 0 || id === undefined) {
    return undefined;
  }
  const result = array.find(arrayElement => arrayElement.id === id);
  return result?.name || undefined;
}

interface SearchState {
  query?: string;
  language?: string;
  users?: string;
  subjects?: string;
  resourceTypes?: string;
  status?: string;
}

interface Props {
  searchObject: SearchState;
  onRemoveItem: (tag: MinimalTagType) => void;
  languages: (tFunc: tType['t']) => { id: string; name: string }[];
  resourceTypes?: FlattenedResourceType[];
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
  const tagTypes: TagType[] = [
    {
      type: 'query',
      id: searchObject.query,
      name: searchObject.query,
    },
    {
      type: 'language',
      id: searchObject.language,
      name: findTagNameWithId(languages(t), searchObject.language),
    },
    {
      type: 'users',
      id: searchObject.users,
      name: findTagNameWithId(users, searchObject.users),
    },
    {
      type: 'subjects',
      id: searchObject.subjects,
      name: findTagNameWithId(subjects, searchObject.subjects),
    },
    {
      type: 'resourceTypes',
      id: searchObject.resourceTypes,
      name: findTagNameWithId(resourceTypes, searchObject.resourceTypes),
    },
    {
      type: 'status',
      id: searchObject.status,
      name: findTagNameWithId(status, searchObject.status),
    },
  ];

  return (
    <Fragment>
      {tagTypes.map((tag: TagType) => {
        if (!tag.name) return null;
        return (
          <SearchTag
            key={`searchtag_${tag.type}`}
            onRemoveItem={onRemoveItem}
            // Hack to make typescript understand the typeguard for the `tag.name` property even if the object is exactly the same
            tag={{ ...tag, name: tag.name }}
          />
        );
      })}
    </Fragment>
  );
};

export default injectT(SearchTagGroup);
