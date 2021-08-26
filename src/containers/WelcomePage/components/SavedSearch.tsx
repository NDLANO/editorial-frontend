/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import BEMHelper from 'react-bem-helper';
import { Link } from 'react-router-dom';
import queryString from 'query-string';

import { injectT, tType } from '@ndla/i18n';
import { DeleteForever } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';

import IconButton from '../../../components/IconButton';
import { fetchSubject, fetchResourceType } from '../../../modules/taxonomy';
import { fetchAuth0Users } from '../../../modules/auth0/auth0Api';
import { getSearchFunctionFromType, transformQuery } from '../../../util/searchHelpers';
import { SearchType } from '../../../interfaces';
import handleError from '../../../util/handleError';

interface Props {
  deleteSearch: Function;
  locale: string;
  search: string;
  index: number;
}

export const classes = new BEMHelper({
  name: 'saved-search',
  prefix: 'c-',
});

const SavedSearch = ({ deleteSearch, locale, search, index, t }: Props & tType) => {
  const [subjectName, setSubjectName] = useState('');
  const [resourceTypeName, setResourceTypeName] = useState('');
  const [userName, setUserName] = useState('');
  const [searchResults, setSearchResults] = useState<number | undefined>(undefined);

  const searchObject = transformQuery(queryString.parse(search));
  const subject = searchObject['subjects'] || '';
  const resourceType = searchObject['resource-types'] || '';
  const userId = searchObject['users'] || '';

  useEffect(() => {
    const fetchSubjectName = async (id: string, locale: string) => {
      const result = await fetchSubject(id, locale);
      setSubjectName(result.name);
    };
    if (subject) {
      fetchSubjectName(subject, locale);
    }
    const fetchResourceTypeName = async (id: string, locale: string) => {
      const result = await fetchResourceType(id, locale);
      setResourceTypeName(result.name);
    };
    if (resourceType) {
      fetchResourceTypeName(resourceType, locale);
    }
    const fetchUser = async (userId: string) => {
      const user = await fetchAuth0Users(userId);
      setUserName(user?.[0].name);
    };
    if (userId) {
      fetchUser(userId);
    }
  }, [subject, resourceType, userId, locale]);

  useEffect(() => {
    (async () => {
      const type = search.split('/')[2].split('?')[0];
      const q = queryString.parse(search);
      try {
        const searchFunction = getSearchFunctionFromType(type as SearchType);
        const res = await searchFunction(q);
        setSearchResults(res.totalCount);
      } catch (e) {
        handleError(e);
      }
    })();
  }, [search]);

  const linkText = (search: string) => {
    const query = searchObject.query || undefined;
    const status = searchObject.status || searchObject['draft-status'] || undefined;
    const contextType = searchObject['context-types'] || undefined;

    const results = [];
    results.push(query);
    results.push(status && t(`form.status.${status.toLowerCase()}`));
    results.push(subject && subjectName);
    results.push(resourceType && resourceTypeName);
    results.push(contextType && t(`contextTypes.topic`));
    results.push(userName);
    const resultHitsString = searchResults !== undefined ? ` (${searchResults})` : '';
    const joinedResults = results.filter(e => e).join(' + ');
    return `${joinedResults}${resultHitsString}`;
  };

  return (
    <div style={{ display: 'flex' }} key={index}>
      <Tooltip tooltip={t('welcomePage.deleteSavedSearch')} align="left">
        <IconButton
          color="red"
          type="button"
          onClick={() => deleteSearch(index)}
          data-cy="remove-element">
          <DeleteForever />
        </IconButton>
      </Tooltip>
      <Link {...classes('link')} to={search}>
        {linkText(search)}
      </Link>
    </div>
  );
};

export default injectT(SavedSearch);
