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

import { useTranslation } from 'react-i18next';
import { DeleteForever } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';

import IconButton from '../../../components/IconButton';
import { fetchSubject, fetchResourceType } from '../../../modules/taxonomy';
import { fetchAuth0Users } from '../../../modules/auth0/auth0Api';
import { getSearchFunctionFromType, transformQuery } from '../../../util/searchHelpers';
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

const SavedSearch = ({ deleteSearch, locale, search, index }: Props) => {
  const { t } = useTranslation();
  const [subjectName, setSubjectName] = useState('');
  const [resourceTypeName, setResourceTypeName] = useState('');
  const [userName, setUserName] = useState('');
  const [searchResults, setSearchResults] = useState<number | undefined>(undefined);
  const [searchUrl, searchParams] = search.split('?');

  const searchObject = transformQuery(queryString.parse(searchParams));
  searchObject['type'] = searchUrl.replace('/search/', '');
  const localizedSearch =
    searchObject['type'] === 'content'
      ? search.replace(`language=${searchObject['language']}`, `language=${locale}`)
      : search;
  if (searchObject['type'] === 'content' && searchObject['language']) {
    searchObject['language'] = locale;
  }
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
      try {
        const searchFunction = getSearchFunctionFromType(searchObject['type']);
        const res = await searchFunction(searchObject);
        setSearchResults(res.totalCount);
      } catch (e) {
        handleError(e);
      }
    })();
  }, [searchObject]);

  const linkText = (searchObject: Record<string, string>) => {
    const query = searchObject.query || undefined;
    const status = searchObject.status || searchObject['draft-status'] || undefined;
    const contextType = searchObject['context-types'] || undefined;
    const language = searchObject['language'] || undefined;
    const type = searchObject['type'] || undefined;
    const audioType = searchObject['audio-type'] || undefined;
    const license = searchObject['license'] || undefined;
    const modelReleased = searchObject['model-released'] || undefined;

    const results = [];
    results.push(type && t(`searchTypes.${type}`));
    results.push(query);
    results.push(language && t(`language.${language}`));
    results.push(audioType);
    results.push(status && t(`form.status.${status.toLowerCase()}`));
    results.push(subject && subjectName);
    results.push(resourceType && resourceTypeName);
    results.push(contextType && t(`contextTypes.topic`));
    results.push(userName);
    results.push(license);
    results.push(modelReleased && t(`imageSearch.modelReleased.${modelReleased}`));
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
      <Link {...classes('link')} to={localizedSearch}>
        {linkText(searchObject)}
      </Link>
    </div>
  );
};

export default SavedSearch;
