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
// import { patchUserMetadata } from '../../../util/apiHelpers';
// import { getNdlaId } from '../../../util/authHelpers';
import IconButton from '../../../components/IconButton';

interface Props {
  t: TranslateType;
}

export const classes = new BEMHelper({
  name: 'save-search',
  prefix: 'c-',
});

export const isNDLAEdSearchUrl = (url: string) =>
  /^http(s)?:\/\/ed.((.*)\.)?ndla.no\/((.*)\/)?search\/\d*/.test(url);

const SaveSearchUrl: FC<Props> = ({ t }) => {
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [newSearchUrl, setNewSearchUrl] = useState(''); // value of input field
  const [savedSearches, setSavedSearches] = useState<string[]>([]);

  // const ndlaIdAuth0 = getNdlaId();

  useEffect(() => {}, [savedSearches]);

  const checkIsValidUrl = (url: string) =>
    url !== '' && isValidURL(url) && isNDLAEdSearchUrl(url)
      ? setIsValidUrl(true)
      : setIsValidUrl(false);

  const getWarningText = () => {
    if (!isValidUrl) {
      if (newSearchUrl === '') {
        return t('form.content.link.required');
      }
      if (!isNDLAEdSearchUrl(newSearchUrl)) {
        return `${t('form.content.link.invalid')} - ${t(
          'welcomePage.mustBeSearch',
        )}`;
      }
    }
    return null;
  };

  const updateUserMetadata = async (searches: string[]) => {
    // await patchUserMetadata(id, {"savedSearches": savedSearches});
    console.log('updated searches', searches);
    setSavedSearches(searches);
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    checkIsValidUrl(event.target.value);
  };

  const handleSaveUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    checkIsValidUrl(newSearchUrl);
    const savedSearch = newSearchUrl.split('search');
    if (isValidUrl && newSearchUrl !== '') {
      const searchUrl = savedSearch[1];
      savedSearches.push(searchUrl);

      setNewSearchUrl('');
      updateUserMetadata(savedSearches);
    }
  };

  const deleteSearch = (index: number) => {
    // TODO: fix this
    savedSearches.splice(index, 1);
    updateUserMetadata(savedSearches);
  };

  const updateUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setNewSearchUrl(event.target.value);
  };

  const searchText = (search: string) => {
    const searchObject = queryString.parse(search);
    const query = searchObject.query || 'Empty search';
    const resourcetype = searchObject['resource-types'] || '';
    const status = searchObject['/content?draft-status'] || '';

    const text = `${query} ${status && `- ${status}`} ${resourcetype &&
      `- ${resourcetype}`}`;
    return text;
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
              {searchText(search)}
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
          warningText={getWarningText()}
          placeholder={t('form.content.link.href')}
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
