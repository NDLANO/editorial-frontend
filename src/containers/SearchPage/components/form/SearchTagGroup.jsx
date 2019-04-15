/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import SearchTag from './SearchTag';
import {
  ResourceTypeShape,
  DraftStatusShape,
  SubjectShape,
  UserShape,
} from '../../../../shapes';

const findTagName = (array, value, arrayKey = undefined) => {
  if (!array || array.length === 0) {
    return undefined;
  }
  const result = array.find(
    arrayElement =>
      (arrayKey ? arrayElement[arrayKey] : arrayElement) === value,
  );
  return result && result.name ? result.name : undefined;
};

const SearchTagGroup = ({
  subjects,
  resourceTypes,
  draftStatus,
  searchObject,
  users,
  languages,
  t,
  onRemoveItem,
}) => {
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
      type: 'draftStatus',
      id: searchObject.draftStatus,
      name: findTagName(draftStatus, searchObject.draftStatus, 'id'),
    },
  ];

  return (
    <Fragment>
      {tagTypes.map(tag => {
        if (!tag.name) return null;
        return (
          <SearchTag
            key={`searchtag_${tag.type}`}
            onRemoveItem={onRemoveItem}
            tag={tag}
          />
        );
      })}
    </Fragment>
  );
};

SearchTagGroup.propTypes = {
  onRemoveItem: PropTypes.func.isRequired,
  subjects: PropTypes.arrayOf(SubjectShape),
  resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  draftStatus: PropTypes.arrayOf(DraftStatusShape),
  users: PropTypes.arrayOf(UserShape),
  languages: PropTypes.func,
  searchObject: PropTypes.shape({
    query: PropTypes.string,
    language: PropTypes.string,
    subjects: PropTypes.string,
    resourceTypes: PropTypes.string,
    draftStatus: PropTypes.string,
    users: PropTypes.string,
  }),
};

export default injectT(SearchTagGroup);
