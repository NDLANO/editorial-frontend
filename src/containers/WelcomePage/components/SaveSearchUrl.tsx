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
import Button from '@ndla/button';
import { FieldHeader, FieldSection, Input } from '@ndla/forms';
import { Link as LinkIcon } from '@ndla/icons/common';
import { DeleteForever } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';

import { TranslateType } from '../../../interfaces';
import { isValidURL } from '../../../util/htmlHelpers';
import IconButton from '../../../components/IconButton';
import { fetchUserData, updateUserData } from '../../../modules/draft/draftApi';

interface Props {
  t: TranslateType;
}

export const classes = new BEMHelper({
  name: 'save-search',
  prefix: 'c-',
});

export const isNDLAEdSearchUrl = (url: string) =>
  /(https?:\/\/)?(www\.)?ed(.*)?\.ndla\.no\/search\//.test(url);

const SaveSearchUrl: FC<Props> = ({ t }) => {
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [inputFieldValue, setInputFieldValue] = useState('');
  const [savedSearches, setSavedSearches] = useState<string[]>([]);

  useEffect(() => {
    fetchSavedSearch();
  }, []);

  const fetchSavedSearch = async () => {
    const result = await fetchUserData();
    const searches = result.savedSearches || [];
    setSavedSearches(searches);
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
    isNDLAEdSearchUrl(inputFieldValue)
      ? setIsValidUrl(true)
      : setIsValidUrl(false);
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
      setSavedSearches(savedSearchesUpdated);
      setInputFieldValue('');
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

  const linkText = (search: string) => {
    const searchObject = queryString.parse(search);
    const query = searchObject.query || 'Empty search'; // TODO: use translated string
    const resourcetype = searchObject['resource-types'] || ''; // TODO: convert to "readable" value
    const status = searchObject['/search/content?draft-status'] || '';

    return `${query} ${status && `- ${status}`} ${resourcetype &&
      `- ${resourcetype}`}`;
  };

  return (
    <>
      {!!savedSearches.length ? (
        savedSearches.map((search, index) => (
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
        ))
      ) : (
        <span>{t('welcomePage.emptySavedSearch')}</span>
      )}

      <FieldHeader title={t('form.content.link.addTitle')} />
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
