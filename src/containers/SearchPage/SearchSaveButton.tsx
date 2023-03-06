/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { colors, fonts, spacing } from '@ndla/core';
import { parse, stringify } from 'query-string';
import { getAccessToken, getAccessTokenPersonal } from '../../util/authHelpers';
import { isValid } from '../../util/jwtHelper';
import SaveButton from '../../components/SaveButton';
import { getSavedSearchRelativeUrl } from '../WelcomePage/components/SaveSearchUrl';
import { useUpdateUserDataMutation, useUserData } from '../../modules/draft/draftQueries';

type Error = 'alreadyExist' | 'other' | 'fetchFailed' | '';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const WarningText = styled.div`
  font-family: ${fonts.sans};
  color: ${colors.support.red};
  ${fonts.sizes(14, 1.1)};
  margin: ${spacing.xsmall} 0;
`;

const createSearchString = (location: Location) => {
  const searchObject = parse(location.search);
  searchObject.page && delete searchObject.page;
  return location.pathname + '?' + stringify(searchObject);
};

const SearchSaveButton = () => {
  const { t } = useTranslation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<Error>('');
  const [loading, setLoading] = useState(false);
  const { data } = useUserData({
    enabled: isValid(getAccessToken()) && getAccessTokenPersonal(),
  });
  const { mutateAsync } = useUpdateUserDataMutation();

  const savedSearches = data?.savedSearches ?? [];

  useEffect(() => {
    setError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.search]);

  const handleSuccess = () => {
    setSuccess(true);
    setLoading(false);
    setTimeout(() => setSuccess(false), 2500);
  };

  const handleFailure = (type: Error) => {
    setLoading(false);
    setError(type);
    setSuccess(false);
  };

  const saveSearch = async () => {
    setError('');
    setLoading(true);
    const oldSearchList = savedSearches;
    if (!oldSearchList) {
      handleFailure('fetchFailed');
      return;
    }

    const newSearch = createSearchString(window.location);
    const newSearchList = [...oldSearchList, getSavedSearchRelativeUrl(newSearch)];
    if (!oldSearchList.find(s => s === getSavedSearchRelativeUrl(newSearch))) {
      mutateAsync({ savedSearches: newSearchList })
        .then(() => handleSuccess())
        .catch(() => handleFailure('other'));
    } else {
      handleFailure('alreadyExist');
    }
  };

  const currentSearch = createSearchString(window.location);
  const isSaved = savedSearches?.includes(getSavedSearchRelativeUrl(currentSearch));

  return (
    <StyledWrapper>
      <SaveButton
        isSaving={loading}
        showSaved={success}
        defaultText={isSaved ? 'alreadySaved' : 'saveSearch'}
        onClick={saveSearch}
        disabled={isSaved || success}
      />
      {error && (
        <WarningText>
          <span>{t('searchPage.save.' + error)}</span>
        </WarningText>
      )}
    </StyledWrapper>
  );
};

export default SearchSaveButton;
