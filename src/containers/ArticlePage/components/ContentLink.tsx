/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { ChangeEvent, useState } from 'react';

import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Input } from '@ndla/forms';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';

const StyledContent = styled.div`
  width: 100%;

  > * {
    width: 100%;
  }

  & form {
    background-color: white;
  }
`;

interface Props {
  onAddLink: (title: string, url: string) => void;
  onClose: () => void;
  initialTitle?: string;
  initialUrl?: string;
}

const ContentLink = ({ onAddLink, onClose, initialTitle = '', initialUrl = '' }: Props) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialTitle);
  const [url, setUrl] = useState(initialUrl);
  const [showError, setShowError] = useState(false);

  const isEmpty = (title: string) => {
    return title === '';
  };

  const isUrl = (field: string) => {
    const pattern = /^((http:|https:)\/\/)/;
    return pattern.test(field);
  };

  const handleSubmit = () => {
    if (!isEmpty(title) && isUrl(url)) {
      onAddLink(title, url);
      onClose();
    } else {
      setShowError(true);
    }
  };

  return (
    <TaxonomyLightbox
      title={t('form.content.relatedArticle.searchExternal')}
      onSelect={handleSubmit}
      onClose={onClose}>
      <StyledContent>
        <Input
          warningText={
            showError && isEmpty(title) ? t('form.relatedContent.link.missingTitle') : undefined
          }
          data-testid="addExternalTitleInput"
          type="text"
          placeholder={t('form.relatedContent.link.titlePlaceholder')}
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        />
        <Input
          warningText={
            showError && !isUrl(url) ? t('form.relatedContent.link.missingUrl') : undefined
          }
          data-testid="addExternalUrlInput"
          type="text"
          placeholder={t('form.relatedContent.link.urlPlaceholder')}
          value={url}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
        />
      </StyledContent>
    </TaxonomyLightbox>
  );
};

export default ContentLink;
