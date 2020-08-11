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

import { injectT } from '@ndla/i18n';
import { DeleteForever } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';

import { TranslateType } from '../../../interfaces';
import IconButton from '../../../components/IconButton';
import { fetchSubject, fetchResourceType } from '../../../modules/taxonomy';
import { transformQuery } from '../../../util/searchHelpers';

interface Props {
  deleteSearch: Function;
  locale: string;
  search: string;
  index: number;
  t: TranslateType;
}

export const classes = new BEMHelper({
  name: 'saved-search',
  prefix: 'c-',
});

const SavedSearch: FC<Props> = ({ deleteSearch, locale, search, index, t }) => {
  const [subjectName, setSubjectName] = useState('');
  const [resourceTypeName, setResourceTypeName] = useState('');

  const searchObject = transformQuery(queryString.parse(search));
  const subject = searchObject['subjects'] || '';
  const resourceType = searchObject['resource-types'] || '';

  useEffect(() => {
    if (subject) {
      fetchSubjectName(subject, locale);
    }
    if (resourceType) {
      fetchResourceTypeName(resourceType, locale);
    }
  }, [subject, resourceType]);

  const fetchSubjectName = async (id: string, locale: string) => {
    const result = await fetchSubject(id, locale);
    setSubjectName(result.name);
  };

  const fetchResourceTypeName = async (id: string, locale: string) => {
    const result = await fetchResourceType(id, locale);
    setResourceTypeName(result.name);
  };

  const linkText = (search: string) => {
    const query = searchObject.query || t('welcomePage.emptySearchQuery');
    const status = searchObject['/search/content?draft-status'] || '';
    const contextType = searchObject['context-types'] || '';

    return `${query} ${status &&
      `- ${t(`form.status.${status.toLowerCase()}`)}`} ${subject &&
      `- ${subjectName}`} ${resourceType &&
      `- ${resourceTypeName}`} ${contextType && `- ${t(`contextTypes.topic`)}`}
      `;
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
