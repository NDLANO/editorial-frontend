/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { TextAreaV2 } from '@ndla/forms';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';
import { textAreaStyles } from './Comment';

const ModalContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: ${spacing.xsmall};
`;
interface Props {
  onClose: () => void;
}

const AddCommentModal = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('Til Fornavn Etternavn: \n');

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInputValue(e.target.value);
  };

  return (
    <TaxonomyLightbox onClose={onClose} title={t('form.addComment')} position="center">
      <ModalContent>
        <TextAreaV2
          css={textAreaStyles}
          label={t('form.commentField')}
          name={t('form.commentField')}
          placeholder={`${t('form.comment')}...`}
          labelHidden
          value={inputValue}
          onChange={handleInputChange}
        />
        <ButtonWrapper>
          <ButtonV2 shape="pill" colorTheme="greyLighter">
            {t('form.saveWithoutComment')}
          </ButtonV2>
          <ButtonV2 shape="pill" variant="outline">
            {t('form.save')}
          </ButtonV2>
        </ButtonWrapper>
      </ModalContent>
    </TaxonomyLightbox>
  );
};

export default AddCommentModal;
