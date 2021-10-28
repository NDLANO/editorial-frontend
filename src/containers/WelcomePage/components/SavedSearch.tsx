/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import BEMHelper from 'react-bem-helper';
import { Link } from 'react-router-dom';
import queryString from 'query-string';

import { useTranslation } from 'react-i18next';
import { DeleteForever } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';

import IconButton from '../../../components/IconButton';
import { transformQuery } from '../../../util/searchHelpers';
import { useSavedSearchUrl } from '../hooks/savedSearchHook';

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
  const [searchUrl, searchParams] = search.split('?');

  const searchObject = transformQuery(queryString.parse(searchParams));
  const subject = searchObject['subjects'] || '';
  const resourceType = searchObject['resource-types'] || '';

  searchObject['type'] = searchUrl.replace('/search/', '');
  const localizedSearch =
    searchObject['type'] === 'content'
      ? search.replace(`language=${searchObject['language']}`, `language=${locale}`)
      : search;
  if (searchObject['type'] === 'content' && searchObject['language']) {
    searchObject['language'] = locale;
  }
  const { data, loading } = useSavedSearchUrl(searchObject, locale);

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
    results.push(subject && data?.subject?.name);
    results.push(resourceType && data?.resourceType?.name);
    results.push(contextType && t(`contextTypes.topic`));
    results.push(data?.user?.[0].name);
    results.push(license);
    results.push(modelReleased && t(`imageSearch.modelReleased.${modelReleased}`));
    const resultHitsString =
      data.searchResult !== undefined ? ` (${data.searchResult.totalCount})` : '';
    const joinedResults = results.filter(e => e).join(' + ');
    return `${joinedResults}${resultHitsString}`;
  };

  if (loading) {
    return null;
  }

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
