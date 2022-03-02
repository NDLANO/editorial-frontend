/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ChangeEvent, useState, MouseEvent } from 'react';

import BEMHelper from 'react-bem-helper';

import { useTranslation } from 'react-i18next';
import Button from '@ndla/button';
import { FieldHeader, FieldSection, Input } from '@ndla/forms';
import { Link as LinkIcon } from '@ndla/icons/common';

import { getAccessToken, getAccessTokenPersonal } from '../../../util/authHelpers';
import { isValid } from '../../../util/jwtHelper';

import SavedSearch from './SavedSearch';
import { updateUserData } from '../../../modules/draft/draftApi';
import { isNDLAEdSearchUrl } from '../../../util/htmlHelpers';
import { useUpdateUserDataMutation, useUserData } from '../../../modules/draft/draftQueries';

export const classes = new BEMHelper({
  name: 'save-search',
  prefix: 'c-',
});

export const updateUserMetadata = async (searches: string[]) => {
  const userUpdatedMetadata = { savedSearches: searches };
  updateUserData(userUpdatedMetadata);
};

export const getSavedSearchRelativeUrl = (inputValue: string) => {
  const relativeUrl = inputValue.split('search')[1];
  return '/search'.concat(relativeUrl);
};

const SaveSearchUrl = () => {
  const { t } = useTranslation();
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [inputFieldValue, setInputFieldValue] = useState('');
  const { data } = useUserData({
    enabled: isValid(getAccessToken()) && getAccessTokenPersonal(),
  });

  const userDataMutation = useUpdateUserDataMutation();

  if (!data) return null;

  const savedSearches = data.savedSearches ?? [];

  const getWarningText = () => {
    if (!isValidUrl) {
      if (inputFieldValue === '') {
        return t('form.content.link.required');
      }
      if (!isNDLAEdSearchUrl(inputFieldValue)) {
        return `${t('form.content.link.invalid')} - ${t('welcomePage.mustBeSearch')}`;
      }
    }
    return null;
  };

  const handleBlur = () => {
    setIsValidUrl(isNDLAEdSearchUrl(inputFieldValue));
  };

  const createSaveSearchUrl = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (
      isNDLAEdSearchUrl(inputFieldValue) &&
      inputFieldValue !== '' &&
      !savedSearches.filter(s => s === getSavedSearchRelativeUrl(inputFieldValue)).length
    ) {
      const savedSearchesUpdated = [...savedSearches, getSavedSearchRelativeUrl(inputFieldValue)];
      setInputFieldValue('');
      userDataMutation.mutate({ savedSearches: savedSearchesUpdated });
    } else {
      setIsValidUrl(false);
    }
  };

  const deleteSearch = (index: number) => {
    const reduced_array = savedSearches.filter((_, idx) => idx !== index);
    userDataMutation.mutate({ savedSearches: reduced_array });
  };

  return (
    <>
      {!!savedSearches.length ? (
        savedSearches.map((search, index) => (
          <SavedSearch key={search} deleteSearch={deleteSearch} search={search} index={index} />
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
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setInputFieldValue(event.target.value)
          }
          onBlur={handleBlur}
        />
      </FieldSection>
      <Button onClick={createSaveSearchUrl}>{t('welcomePage.saveSearch')}</Button>
    </>
  );
};

export default SaveSearchUrl;
