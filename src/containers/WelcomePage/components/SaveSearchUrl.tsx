/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC, useState, useEffect } from 'react';
import BEMHelper from 'react-bem-helper';

import { injectT, tType } from '@ndla/i18n';
import Button from '@ndla/button';
import { FieldHeader, FieldSection, Input } from '@ndla/forms';
import { Link as LinkIcon } from '@ndla/icons/common';

import {
  getAccessToken,
  getAccessTokenPersonal,
} from '../../../util/authHelpers';
import { isValid } from '../../../util/jwtHelper';

import SavedSearch from './SavedSearch';
import { fetchUserData, updateUserData } from '../../../modules/draft/draftApi';
import { isNDLAEdSearchUrl } from '../../../util/htmlHelpers';

interface Props {
  locale: string;
}

export const classes = new BEMHelper({
  name: 'save-search',
  prefix: 'c-',
});

const SaveSearchUrl: FC<Props & tType> = ({ locale, t }) => {
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [inputFieldValue, setInputFieldValue] = useState('');
  const [savedSearches, setSavedSearches] = useState<string[]>([]);

  useEffect(() => {
    fetchSavedSearch();
  }, []);

  const fetchSavedSearch = async () => {
    const token = getAccessToken();
    const isAccessTokenPersonal = getAccessTokenPersonal();

    if (isValid(token) && isAccessTokenPersonal) {
      const result = await fetchUserData();
      const searches = result.savedSearches || [];
      setSavedSearches(searches);
    }
  };

  const updateUserMetadata = async (searches: string[]) => {
    const userUpdatedMetadata = { savedSearches: searches };
    updateUserData(userUpdatedMetadata);
  };

  const getWarningText = () => {
    if (!isValidUrl) {
      if (inputFieldValue === '') {
        return t('form.content.link.required');
      }
      if (!isNDLAEdSearchUrl(inputFieldValue)) {
        return `${t('form.content.link.invalid')} - ${t(
          'welcomePage.mustBeSearch',
        )}`;
      }
    }
    return null;
  };

  const handleBlur = () => {
    setIsValidUrl(isNDLAEdSearchUrl(inputFieldValue));
  };

  const getSavedSearchRelativeUrl = (inputValue: string) => {
    const relativeUrl = inputValue.split('search')[1];
    return '/search'.concat(relativeUrl);
  };

  const createSaveSearchUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (
      isNDLAEdSearchUrl(inputFieldValue) &&
      inputFieldValue !== '' &&
      !savedSearches.filter(
        s => s === getSavedSearchRelativeUrl(inputFieldValue),
      ).length
    ) {
      const savedSearchesUpdated = [
        ...savedSearches,
        getSavedSearchRelativeUrl(inputFieldValue),
      ];
      setInputFieldValue('');
      setSavedSearches(savedSearchesUpdated);
      updateUserMetadata(savedSearchesUpdated);
    } else {
      setIsValidUrl(false);
    }
  };

  const deleteSearch = (index: number) => {
    const reduced_array = savedSearches.filter((_, idx) => idx !== index);
    setSavedSearches(reduced_array);
    updateUserMetadata(reduced_array);
  };

  return (
    <>
      {!!savedSearches.length ? (
        savedSearches.map((search, index) => (
          <SavedSearch
            key={search}
            deleteSearch={deleteSearch}
            locale={locale}
            search={search}
            index={index}
          />
        ))
      ) : (
        <span>{t('welcomePage.emptySavedSearch')}</span>
      )}

      <FieldHeader title={t('welcomePage.addSearch')} />
      <FieldSection>
        <Input
          type="text"
          name={t('welcomePage.saveSearch')}
          value={inputFieldValue}
          warningText={getWarningText()}
          placeholder={t('form.content.link.href')}
          iconRight={<LinkIcon />}
          container="div"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setInputFieldValue(event.target.value)
          }
          onBlur={handleBlur}
        />
      </FieldSection>
      <Button onClick={createSaveSearchUrl}>
        {t('welcomePage.saveSearch')}
      </Button>
    </>
  );
};

export default injectT(SaveSearchUrl);
