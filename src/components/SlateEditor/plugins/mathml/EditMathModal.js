/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
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
  handleCancel,
  handleContinue,
  openDiscardModal,
  renderMathML,
  isEditMode,
  onExit,
  previewMath,
  t,
}) => (
  <Modal
    narrow
    controllable
    isOpen={isEditMode}
    size="large"
    backgroundColor="white"
    onClose={() => handleExit(onExit)}
    minHeight="90vh">
    {onCloseModal => (
      <Fragment>
        <ModalHeader>
          <ModalCloseButton
            title={t('dialog.close')}
            onClick={() => handleExit(onCloseModal)}
          />
        </ModalHeader>
        <ModalBody>
          <h1>{t('mathEditor.editMath')}</h1>
          <hr />
          <StyledMathEditorWrapper id="mathEditorContainer" />
          <StyledButtonWrapper>
            <Button outline css={buttonStyle} onClick={previewMath}>
              {t('form.preview.button')}
            </Button>
            <Button
              outline
              css={buttonStyle}
              onClick={() => handleSave(onCloseModal(onExit))}>
              {t('form.save')}
            </Button>
            <Button
              outline
              css={buttonStyle}
              onClick={() => handleExit(onCloseModal)}>
              {t('form.abort')}
            </Button>
            <Button
              outline
              css={buttonStyle}
              onClick={() => handleRemove(onCloseModal)}>
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
                onClick: handleCancel,
              },
              {
                text: t('alertModal.continue'),
                onClick: handleContinue,
              },
            ]}
            onCancel={handleCancel}
          />
        </ModalBody>
      </Fragment>
    )}
  </Modal>
);

EditMathModal.propTypes = {
  onExit: PropTypes.func.isRequired,
  handleExit: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleContinue: PropTypes.func.isRequired,
  openDiscardModal: PropTypes.bool.isRequired,
  previewMath: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  renderMathML: PropTypes.string,
};

export default injectT(EditMathModal);
