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
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useCommentsContext } from '../../../components/SlateEditor/CommentsProvider';
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
  inputValue: string;
  setInputValue: (input: string) => void;
  onSaveClick: (saveAsNewVersion?: boolean | undefined) => void;
  saveAsNewVersion: boolean;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
}

const AddCommentModal = ({
  onClose,
  inputValue,
  setInputValue,
  onSaveClick,
  saveAsNewVersion,
  setFieldValue,
}: Props) => {
  const { t } = useTranslation();
  const { comments, setComments } = useCommentsContext();

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInputValue(e.target.value);
  };

  const handleSave = () => {
    onSaveClick(saveAsNewVersion);
    onClose();
  };
  const handleSaveWithComment = async () => {
    const updatedComments = [{ content: inputValue }, ...comments];
    setFieldValue('comments', updatedComments);
    setComments(updatedComments);
    onClose();
  };
  return (
    <TaxonomyLightbox
      onClose={onClose}
      title={t('form.workflow.addComment.title')}
      position="center"
    >
      <ModalContent>
        <TextAreaV2
          css={textAreaStyles}
          label={t('form.workflow.addComment.title')}
          name={t('form.workflow.addComment.title')}
          placeholder={`${t('form.comment')}...`}
          labelHidden
          value={inputValue}
          onChange={handleInputChange}
        />
        <ButtonWrapper>
          <ButtonV2 shape="pill" colorTheme="greyLighter" onClick={handleSave}>
            {t('form.workflow.addComment.button')}
          </ButtonV2>
          <ButtonV2 shape="pill" variant="outline" onClick={handleSaveWithComment}>
            {t('form.save')}
          </ButtonV2>
        </ButtonWrapper>
      </ModalContent>
    </TaxonomyLightbox>
  );
};

export default AddCommentModal;
