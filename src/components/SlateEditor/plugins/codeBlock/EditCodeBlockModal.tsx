/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
import { spacing } from '@ndla/core';

import AlertModal from '../../../AlertModal';
import { TranslateType } from '../../../../interfaces';


const StyledCodeBlockPreviewWrapper = styled('div')`
  padding: ${spacing.small} 0;
  display: flex;
  overflow: auto;
`;

const StyledButtonWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const buttonStyle = css`
  margin-right: ${spacing.small};
`;

interface Props {
  handleCancelDiscard: Function;
  handleContinue: Function;
  handleExit: Function;
  handleRemove: Function;
  handleSave: Function;
  openDiscardModal: boolean;
  previewCodeBlock: Function;
  renderCodeBlock: string;
  t: TranslateType;
}

const EditCodeBlockModal: FC<Props> = ({
  handleCancelDiscard,
  handleContinue,
  handleExit,
  handleRemove,
  handleSave,
  openDiscardModal,
  previewCodeBlock,
  renderCodeBlock,
  t,
}) => (
  <Modal
    narrow
    controllable
    isOpen
    size="large"
    backgroundColor="white"
    onClose={handleExit}
    minHeight="90vh">
    {onCloseModal => (
      <>
        <ModalHeader>
          <ModalCloseButton title={t('dialog.close')} onClick={onCloseModal} />
        </ModalHeader>
        <ModalBody>
          <h1>Rediger kodeblokk</h1> {/* TODO phrases */}
          <hr />
          <div id="programmingLanguageSelector" />
          <div id="codeBlockEditorContainer" />
          <StyledButtonWrapper>
            <Button outline css={buttonStyle} onClick={previewCodeBlock}>
              {t('form.preview.button')}
            </Button>
            <Button outline css={buttonStyle} onClick={handleSave}>
              {t('form.save')}
            </Button>
            <Button outline css={buttonStyle} onClick={onCloseModal}>
              {t('form.abort')}
            </Button>
            <Button outline css={buttonStyle} onClick={handleRemove}>
              {t('form.remove')}
            </Button>
          </StyledButtonWrapper>
          <h3>{t('mathEditor.preview')}</h3>
          <hr />
          <StyledCodeBlockPreviewWrapper
            dangerouslySetInnerHTML={{
              __html: renderCodeBlock,
            }}
          />
          <AlertModal
            show={openDiscardModal}
            text={t('mathEditor.continue')}
            actions={[
              {
                text: t('form.abort'),
                onClick: handleCancelDiscard,
              },
              {
                text: t('alertModal.continue'),
                onClick: handleContinue,
              },
            ]}
            onCancel={handleCancelDiscard}
          />
        </ModalBody>
      </>
    )}
  </Modal>
);

export default injectT(EditCodeBlockModal);
