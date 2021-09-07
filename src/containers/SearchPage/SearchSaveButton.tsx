/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { colors, fonts, spacing } from '@ndla/core';
import { fetchUserData } from '../../modules/draft/draftApi';
import { getAccessToken, getAccessTokenPersonal } from '../../util/authHelpers';
import { isValid } from '../../util/jwtHelper';
import {
  updateUserMetadata,
  getSavedSearchRelativeUrl,
} from '../WelcomePage/components/SaveSearchUrl';
import SaveButton from '../../components/SaveButton';

type Error = 'alreadyExist' | 'other' | '';

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

const SearchSaveButton = () => {
  const { t } = useTranslation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<Error>('');
  const [loading, setLoading] = useState(false);

  const fetchSavedSearch = async () => {
    const token = getAccessToken();
    const isAccessTokenPersonal = getAccessTokenPersonal();

    if (isValid(token) && isAccessTokenPersonal) {
      const result = await fetchUserData();
      return result.savedSearches || [];
    }
    throw Error();
  };

  const handleSuccess = () => {
    setSuccess(true);
    setLoading(false);
    setTimeout(() => {
      setSuccess(false);
    }, 2500);
  };

  const handleFailure = (type: Error) => {
    setLoading(false);
    setError(type);
    setSuccess(false);
  };

  const saveSearch = async () => {
    setLoading(true);
    const oldSearchList = await fetchSavedSearch();
    const newSearch = window.location.pathname + window.location.search;

    if (!oldSearchList.find(s => s === getSavedSearchRelativeUrl(newSearch))) {
      updateUserMetadata([...oldSearchList, getSavedSearchRelativeUrl(newSearch)])
        .then(() => {
          handleSuccess();
        })
        .catch(() => {
          handleFailure('other');
        });
    } else {
      handleFailure('alreadyExist');
    }
  };

  return (
    <StyledWrapper>
      <SaveButton
        isSaving={loading}
        showSaved={success}
        defaultText={'saveSearch'}
        onClick={saveSearch}
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
