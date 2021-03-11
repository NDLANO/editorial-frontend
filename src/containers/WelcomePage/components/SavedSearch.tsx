/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC, useState, useEffect } from 'react';
import BEMHelper from 'react-bem-helper';
import { Link } from 'react-router-dom';
import queryString from 'query-string';

import { injectT, tType } from '@ndla/i18n';
import { DeleteForever } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';

import IconButton from '../../../components/IconButton';
import { fetchSubject, fetchResourceType } from '../../../modules/taxonomy';
import { fetchAuth0Users } from '../../../modules/auth0/auth0Api';
import { transformQuery } from '../../../util/searchHelpers';

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

const SavedSearch: FC<Props & tType> = ({ deleteSearch, locale, search, index, t }) => {
  const [subjectName, setSubjectName] = useState('');
  const [resourceTypeName, setResourceTypeName] = useState('');
  const [userName, setUserName] = useState('');

  const searchObject = transformQuery(queryString.parse(search));
  const subject = searchObject['subjects'] || '';
  const resourceType = searchObject['resource-types'] || '';
  const userId = searchObject['users'] || '';

  useEffect(() => {
    if (subject) {
      fetchSubjectName(subject, locale);
    }
    if (resourceType) {
      fetchResourceTypeName(resourceType, locale);
    }
    if (userId) {
      fetchUser(userId);
    }
  }, [subject, resourceType, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSubjectName = async (id: string, locale: string) => {
    const result = await fetchSubject(id, locale);
    setSubjectName(result.name);
  };

  const fetchResourceTypeName = async (id: string, locale: string) => {
    const result = await fetchResourceType(id, locale);
    setResourceTypeName(result.name);
  };

  const fetchUser = async (userId: string) => {
    const user = await fetchAuth0Users(userId);
    setUserName(user?.[0].name);
  };

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

    return results
      .filter(function(e) {
        return e;
      })
      .join(' + ');
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
