import React, { FC, useState } from 'react';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
import { FieldHeader, FieldSection, FieldSplitter, Input } from '@ndla/forms';
import { Link as LinkIcon } from '@ndla/icons/common';

import { TranslateType } from '../../../interfaces';
import { isValidURL } from '../../../util/htmlHelpers';

interface Props {
  t: TranslateType;
}

const SaveSearchUrl: FC<Props> = ({ t }) => {
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [url, setUrl] = useState('');
  const [savedSearches, setSavedSearches] = useState<string[]>([]);

  const checkIsValidUrl = (url: string) =>
    // TODO: Check if editorial/intern/search link
    url !== '' && isValidURL(url) ? setIsValidUrl(true) : setIsValidUrl(false);

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    checkIsValidUrl(event.target.value);
  };

  const handleSaveUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    checkIsValidUrl(url);
    if (isValidUrl) {
      setSavedSearches([...savedSearches, url]);
      setUrl('');
    }
  };

  const getWarningText = () => {
    if (!isValidUrl) {
      return t('form.content.link.invalid');
    }
    if (url === '') {
      return t('form.content.link.required');
    }
    return null;
  };

  const updateUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setUrl(event.target.value);
  };

  return (
    <div>
      <ul>
        {!!savedSearches.length && savedSearches.map(text => <li>{text}</li>)}
      </ul>

      <FieldHeader title={t('form.content.link.addTitle')} />
      <FieldSection>
        <FieldSplitter>
          <Input
            type="text"
            name={t('welcomePage.saveSearch')}
            value={url}
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
