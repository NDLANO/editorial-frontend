/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { spacing, misc, colors, fonts } from '@ndla/core';
import Downshift from 'downshift';
import { useTranslation } from 'react-i18next';
import { FormEvent, useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import SavedSearchItem from './components/SavedSearchItem';
import { useUpdateUserDataMutation, useUserData } from '../../modules/draft/draftQueries';
import { getAccessToken, getAccessTokenPersonal } from '../../util/authHelpers';
import { isValid } from '../../util/jwtHelper';
import { parseSearchParams } from '../SearchPage/components/form/SearchForm';
import { toSearch } from '../../util/routeHelpers';
import MastheadSearchForm from './components/MastheadSearchForm';

const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledDropdown = styled.ul`
  position: absolute;
  z-index: 3;
  background-color: ${colors.white};
  list-style: none;
  width: 100%;
  padding: ${spacing.small};
  border-radius: ${misc.borderRadius};
  margin: 0;
  box-shadow: 0px 0px 9px -3px ${colors.black};
  max-height: 300px;
  overflow-y: scroll;
`;

const StyledTitle = styled.h3`
  font-weight: ${fonts.weight.semibold};
  font-size: ${fonts.sizes('16px')};
  margin: 0;
`;
const StyledNoHits = styled.div`
  ${fonts.sizes('16px')};
`;

const StyledSavedSearchItem = styled(SavedSearchItem)`
  background-color: ${colors.white};
  &[data-highlighted='true'] {
    background-color: ${colors.brand.light};
    border-radius: ${misc.borderRadius};
  }
`;

const pathToTypeMapping: Record<string, string> = {
  'image-upload': 'image',
  'audio-upload': 'audio',
  concept: 'concept',
  'podcast-series': 'podcast-series',
  default: 'content',
};

interface Props {
  onClose: () => void;
}

const SearchDropdown = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const { data } = useUserData({
    enabled: isValid(getAccessToken()) && getAccessTokenPersonal(),
  });
  const userDataMutation = useUpdateUserDataMutation();
  const location = useLocation();
  const navigate = useNavigate();
  const queryFromUrl = queryString.parse(location.search).query ?? '';
  const input = document.getElementById('masthead-search-input');

  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState(queryFromUrl);

  const onMenuOpen = useCallback(
    (open: boolean): void => {
      setMenuOpen(open);
      onClose();
    },
    [onClose],
  );

  const deleteSearch = (index: number) => {
    const reduced_array = data?.savedSearches?.filter((_, idx) => idx !== index);
    userDataMutation.mutate({ savedSearches: reduced_array });
  };
  const onSearchQuerySubmit = (searchQuery: string) => {
    const matched = location.pathname.split('/').find((v) => !!pathToTypeMapping[v]);
    const type = matched ? pathToTypeMapping[matched] : pathToTypeMapping.default;
    const oldParams =
      type === 'content' ? parseSearchParams(location.search) : queryString.parse(location.search);
    const sort = type === 'content' || type === 'concept' ? '-lastUpdated' : '-relevance';

    const newParams = {
      ...oldParams,
      query: searchQuery || undefined,
      page: 1,
      sort,
      'page-size': 10,
    };

    navigate(toSearch(newParams, type));

    onMenuOpen(false);
  };

  const handleQueryChange = (evt: FormEvent<HTMLInputElement>) => {
    onMenuOpen(evt.currentTarget.value === '');
    setQuery(evt.currentTarget.value);
  };

  const onElementClick = () => {
    setMenuOpen(false);
    if (input) input.blur();
  };

  return (
    <Downshift
      itemToString={(item) => (item ? item.value : '')}
      isOpen={menuOpen}
      onSelect={onElementClick}
    >
      {({ getInputProps, getItemProps, getMenuProps, isOpen, highlightedIndex, getRootProps }) => {
        return (
          <DropdownWrapper {...getRootProps()}>
            <MastheadSearchForm
              {...getInputProps({
                onChange: handleQueryChange,
                ref: null,
              })}
              onSearchQuerySubmit={(searchQuery: string) => onSearchQuerySubmit(searchQuery)}
              query={query}
              setQuery={setQuery}
              setMenuOpen={onMenuOpen}
            />
            {isOpen ? (
              <StyledDropdown {...getMenuProps()}>
                <StyledTitle>{t('welcomePage.savedSearch')}</StyledTitle>
                {data?.savedSearches?.length ? (
                  data.savedSearches.map((item, index) => (
                    <StyledSavedSearchItem
                      key={`${item}_${index}`}
                      searchText={item}
                      userData={data}
                      deleteSearch={deleteSearch}
                      index={index}
                      data-highlighted={highlightedIndex === index}
                      {...getItemProps({
                        index,
                        item,
                      })}
                    />
                  ))
                ) : (
                  <StyledNoHits>{t('welcomePage.emptySavedSearch')}</StyledNoHits>
                )}
              </StyledDropdown>
            ) : null}
          </DropdownWrapper>
        );
      }}
    </Downshift>
  );
};

export default SearchDropdown;
