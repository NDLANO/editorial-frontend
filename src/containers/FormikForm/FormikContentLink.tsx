/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC, useState } from 'react';
import { injectT, tType } from '@ndla/i18n';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { Input } from '@ndla/forms';
import Button from '@ndla/button';

interface Props {
  onAddLink: (title: string, url: string) => void;
  onClose: () => void;
}

const FormikContentLink: FC<Props & tType> = ({ t, onAddLink, onClose }) => {
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
    <>
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
      <StyledButtonWrapper>
        <Button onClick={handleSubmit}>{t('form.relatedContent.link.addLink')}</Button>
      </StyledButtonWrapper>
    </>
  );
};

const StyledButtonWrapper = styled.div`
  margin: ${spacing.small} 0;
`;

export default injectT(FormikContentLink);
