import React, { FC, useState, useEffect } from 'react';
import BEMHelper from 'react-bem-helper';
import { Link } from 'react-router-dom';

import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
import { FieldHeader, FieldSection, Input } from '@ndla/forms';
import { Link as LinkIcon } from '@ndla/icons/common';
import { DeleteForever } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';

import { TranslateType } from '../../../interfaces';
import { isValidURL } from '../../../util/htmlHelpers';
// import { patchUserMetadata } from '../../../util/apiHelpers';
import IconButton from '../../../components/IconButton';

interface Props {
  t: TranslateType;
}

export const classes = new BEMHelper({
  name: 'save-search',
  prefix: 'c-',
});

const SaveSearchUrl: FC<Props> = ({ t }) => {
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [newSearchUrl, setNewSearchUrl] = useState('');
  const [savedSearches, setSavedSearches] = useState<string[]>([
    '/content?page=1&page-size=10&query=ndla&sort=-lastUpdated', // TODO remove - for testing
  ]);

  useEffect(() => {}, [savedSearches]);

  const checkIsValidUrl = (url: string) =>
    // TODO: How to check if valid url?
    url !== '' && isValidURL(url) && url.includes('/search/')
      ? setIsValidUrl(true)
      : setIsValidUrl(false);

  const getWarningText = () => {
    if (!isValidUrl) {
      return `${t('form.content.link.invalid')} - ${t(
        'welcomePage.mustBeSearch',
      )}`;
    }
    if (newSearchUrl === '') {
      return t('form.content.link.required');
    }
    if (!newSearchUrl.includes('/search/')) {
      return t('welcomePage.mustBeSearch');
    }
    return null;
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    checkIsValidUrl(event.target.value);
  };

  const handleSaveUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    checkIsValidUrl(newSearchUrl);
    const savedSearch = newSearchUrl.split('search');
    if (isValidUrl) {
      savedSearches.push(savedSearch[1]);
      setNewSearchUrl('');
    }
  };

  const deleteSearch = (index: number) => {
    const deletingSearch = savedSearches.splice(index, 1);
    setSavedSearches(savedSearches);
  };

  const updateUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setNewSearchUrl(event.target.value);
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
            {/* TODO: Link text should probably be replace with query text */}
            <Link {...classes('link')} to={`/search${search}`}>
              {search}
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
          value={newSearchUrl}
          placeholder={t('form.content.link.href')}
          warningText={getWarningText}
          iconRight={<LinkIcon />}
          container="div"
          onChange={updateUrl}
          onBlur={handleBlur}
        />
      </FieldSection>
      <Button onClick={handleSaveUrl}>{t('welcomePage.saveSearch')}</Button>
    </>
  );
};
export default injectT(SaveSearchUrl);
