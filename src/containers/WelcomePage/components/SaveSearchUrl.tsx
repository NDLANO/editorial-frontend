import React, { FC, useState, useEffect } from 'react';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
import { FieldHeader, FieldSection, FieldSplitter, Input } from '@ndla/forms';
import { Link as LinkIcon } from '@ndla/icons/common';
import { DeleteForever } from '@ndla/icons/editor';

import { TranslateType } from '../../../interfaces';
import { isValidURL } from '../../../util/htmlHelpers';
import StyledFilledButton from '../../../components/StyledFilledButton';

interface Props {
  t: TranslateType;
}

const SaveSearchUrl: FC<Props> = ({ t }) => {
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [newSearchUrl, setNewSearchUrl] = useState('');
  const [savedSearches, setSavedSearches] = useState<string[]>([
    'https://ed.test.ndla.no/search/1',
  ]);

  useEffect(() => {}, [savedSearches]);

  const checkIsValidUrl = (url: string) =>
    // TODO: Check if editorial/intern/search link
    url !== '' && isValidURL(url) ? setIsValidUrl(true) : setIsValidUrl(false);

  const getWarningText = () => {
    if (!isValidUrl) {
      return `${t('form.content.link.invalid')} - Lenken må være et søk`;
    }
    if (newSearchUrl === '') {
      return t('form.content.link.required');
    }
    if (!newSearchUrl.includes('https://ed.test.ndla.no/search/')) {
      return 'Link has to be a search';
    }
    return null;
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    checkIsValidUrl(event.target.value);
  };

  const handleSaveUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    checkIsValidUrl(newSearchUrl);
    if (isValidUrl) {
      setSavedSearches([...savedSearches, newSearchUrl]);
      setNewSearchUrl('');
    }
  };

  const deleteSearch = (index: number) => {
    console.log('Vil du slette?', index);
    savedSearches.splice(index, 1);
    setSavedSearches(savedSearches);
    console.log(savedSearches);
  };

  const updateUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setNewSearchUrl(event.target.value);
  };

  return (
    <div>
      <ul>
        {!!savedSearches.length &&
          savedSearches.map((text, index) => (
            <li key={index}>
              <StyledFilledButton
                type="button"
                deletable
                onClick={() => deleteSearch(index)}>
                <DeleteForever />
              </StyledFilledButton>

              {text}
            </li>
          ))}
      </ul>

      <FieldHeader title={t('form.content.link.addTitle')} />
      <FieldSection>
        <FieldSplitter>
          <Input
            type="text"
            name={t('welcomePage.saveSearch')}
            value={newSearchUrl}
            placeholder={t('form.content.link.href')}
            warningText={getWarningText()}
            iconRight={<LinkIcon />}
            container="div"
            onChange={updateUrl}
            onBlur={handleBlur}
          />
        </FieldSplitter>
      </FieldSection>
      <Button onClick={handleSaveUrl}>{t('welcomePage.saveSearch')}</Button>
    </div>
  );
};
export default injectT(SaveSearchUrl);
