/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import queryString from 'query-string';

import { useTranslation } from 'react-i18next';
import { DeleteForever } from '@ndla/icons/editor';
import { IUserData } from '@ndla/types-draft-api';
import Tooltip from '@ndla/tooltip';
import { IconButtonV2 } from '@ndla/button';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';

import { transformQuery } from '../../../util/searchHelpers';
import { useSavedSearchUrl } from '../hooks/savedSearchHook';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import { SubjectType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { FAVOURITES_SUBJECT_ID } from '../../../constants';

interface Props {
  deleteSearch: Function;
  search: string;
  index: number;
  userData: IUserData;
}

const StyledSearch = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
  align-items: center;
`;

const SavedSearch = ({ deleteSearch, search, index, userData }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const locale = i18n.language;
  const [searchUrl, searchParams] = search.split('?');

  const [searchObject, isFavorite] = useMemo(() => {
    const searchObject = transformQuery(queryString.parse(searchParams));
    const isFavorite = searchObject.subjects === FAVOURITES_SUBJECT_ID;
    return [
      isFavorite
        ? { ...searchObject, subjects: userData.favoriteSubjects?.join(',') }
        : searchObject,
      isFavorite,
    ];
  }, [searchParams, userData?.favoriteSubjects]);

  const resourceType = searchObject['resource-types'] || '';

  searchObject['type'] = searchUrl.replace('/search/', '');
  const localizedSearch =
    searchObject['type'] === 'content'
      ? search.replace(`language=${searchObject['language']}`, `language=${locale}`)
      : search;
  if (searchObject['type'] === 'content' && searchObject['language']) {
    searchObject['language'] = locale;
  }
  const { data, loading } = useSavedSearchUrl(searchObject, locale, taxonomyVersion);

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
    results.push(isFavorite ? t('searchForm.favourites') : data?.subject?.name);
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
    <StyledSearch key={index}>
      <Tooltip tooltip={t('welcomePage.deleteSavedSearch')}>
        <IconButtonV2
          aria-label={t('welcomePage.deleteSavedSearch')}
          colorTheme="danger"
          variant="ghost"
          type="button"
          onClick={() => deleteSearch(index)}
          data-cy="remove-element">
          <DeleteForever />
        </IconButtonV2>
      </Tooltip>
      {/* Not having a className activates undesirable global scss */}
      <Link className="" to={localizedSearch}>
        {linkText(searchObject)}
      </Link>
    </StyledSearch>
  );
};

export default SavedSearch;
