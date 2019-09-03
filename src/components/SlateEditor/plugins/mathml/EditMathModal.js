/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { injectT } from '@ndla/i18n';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Button from '@ndla/button';
import { spacing } from '@ndla/core';
import AlertModal from '../../../AlertModal';

const StyledMathEditorWrapper = styled('div')`
  padding: ${spacing.small} 0;
  height: 40vh;
`;

const StyledMathPreviewWrapper = styled('div')`
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

const EditMathModal = ({
  handleExit,
  handleSave,
  handleRemove,
  handleCancelDiscard,
  handleContinue,
  openDiscardModal,
  renderMathML,
  previewMath,
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
          <h1>{t('mathEditor.editMath')}</h1>
          <hr />
          <StyledMathEditorWrapper id="mathEditorContainer" />
          <StyledButtonWrapper>
            <Button outline css={buttonStyle} onClick={previewMath}>
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
          <StyledMathPreviewWrapper
            dangerouslySetInnerHTML={{
              __html: renderMathML,
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

EditMathModal.propTypes = {
  handleExit: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleCancelDiscard: PropTypes.func.isRequired,
  handleContinue: PropTypes.func.isRequired,
  openDiscardModal: PropTypes.bool.isRequired,
  previewMath: PropTypes.func.isRequired,
  renderMathML: PropTypes.string,
};

export default injectT(EditMathModal);
