/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState } from 'react';
import styled from '@emotion/styled';
import { injectT, tType } from '@ndla/i18n';
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
}

const ContentLink = ({ t, onAddLink, onClose }: Props & tType) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [showError, setShowError] = useState(false);

  const isEmpty = (title: string) => {
    return title === '';
  };

  const isUrl = (field: string) => {
    var pattern = /^((http:|https:)\/\/)/;

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
          warningText={showError && isEmpty(title) && t('form.relatedContent.link.missingTitle')}
          container="div"
          type="text"
          placeholder={t('form.relatedContent.link.titlePlaceholder')}
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        />
        <Input
          warningText={showError && !isUrl(url) && t('form.relatedContent.link.missingUrl')}
          container="div"
          type="text"
          placeholder={t('form.relatedContent.link.urlPlaceholder')}
          value={url}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
        />
      </StyledContent>
    </TaxonomyLightbox>
  );
};

export default injectT(ContentLink);
