/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import queryString from 'query-string';
import styled from '@emotion/styled';
import { colors, fonts, spacing } from '@ndla/core';
import { Search } from '@ndla/icons/common';
import { TrashCanOutline } from '@ndla/icons/action';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { IUserData } from '@ndla/types-backend/draft-api';
import { IconButtonV2 } from '@ndla/button';
import Tooltip from '@ndla/tooltip';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import { transformQuery } from '../../../util/searchHelpers';
import { useSavedSearchUrl } from '../../WelcomePage/hooks/savedSearchHook';
import { FAVOURITES_SUBJECT_ID } from '../../../constants';
import { NoShadowLink } from '../../WelcomePage/components/NoShadowLink';

const StyledItem = styled.li`
  ${fonts.sizes('16px')};
  color: ${colors.brand.primary};
  cursor: pointer;
  padding: ${spacing.xsmall} 0;
  margin: 0;
  border-top: 1px solid ${colors.brand.neutral7};
`;
const StyledContent = styled.div`
  display: flex;
  align-items: center;
`;

const StyledNoShadowLink = styled(NoShadowLink)`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const StyledSearch = styled(Search)`
  width: 24px;
  height: 24px;
  margin-right: ${spacing.small};
`;
const StyledTrashCanOutline = styled(TrashCanOutline)`
  width: 24px;
  height: 24px;
`;
interface Props {
  searchText: string;
  userData: IUserData;
  deleteSearch: (item: number) => void;
  index: number;
}
const SavedSearchItem = ({ searchText, userData, deleteSearch, index, ...rest }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const locale = i18n.language;
  const [searchUrl, searchParams] = searchText.split('?');
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
  const articleType = searchObject['article-types'] || '';

  searchObject['type'] = searchUrl.replace('/search/', '');
  const localizedSearch =
    searchObject['type'] === 'content'
      ? searchText.replace(`language=${searchObject['language']}`, `language=${locale}`)
      : searchText;
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
    const responsible = searchObject['responsible-ids'] || undefined;

    const results = [];
    results.push(type && t(`searchTypes.${type}`));
    results.push(query && `"${query}"`);
    results.push(language && t(`language.${language}`));
    results.push(audioType);
    results.push(status && t(`form.status.${status.toLowerCase()}`));
    results.push(isFavorite ? t('searchForm.favourites') : data?.subject?.name);
    results.push(resourceType && data?.resourceType?.name);
    results.push(articleType && t(`articleType.${articleType}`));
    results.push(contextType && t(`contextTypes.topic`));
    results.push(data?.user?.[0].name);
    results.push(license);
    results.push(modelReleased && t(`imageSearch.modelReleased.${modelReleased}`));
    results.push(responsible && t(`searchForm.tagType.responsible-ids`));

    const resultHitsString =
      data.searchResult !== undefined ? ` (${data.searchResult.totalCount})` : '';
    const joinedResults = results.filter((e) => e).join(' + ');
    return `${joinedResults}${resultHitsString}`;
  };

  if (loading) {
    return null;
  }
  return (
    <StyledItem {...rest}>
      <StyledContent>
        <StyledNoShadowLink to={localizedSearch}>
          <StyledSearch />
          {linkText(searchObject)}
        </StyledNoShadowLink>
        <Tooltip tooltip={t('welcomePage.deleteSavedSearch')}>
          <IconButtonV2
            aria-label={t('welcomePage.deleteSavedSearch')}
            variant="ghost"
            onClick={(e) => {
              deleteSearch(index);
              e.stopPropagation();
            }}
            size="xsmall"
          >
            <StyledTrashCanOutline />
          </IconButtonV2>
        </Tooltip>
      </StyledContent>
    </StyledItem>
  );
};

export default SavedSearchItem;
