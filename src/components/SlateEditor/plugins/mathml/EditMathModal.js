import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { injectT } from '@ndla/i18n';
import styled from 'react-emotion';
import Button from '@ndla/button';
import { spacing } from '@ndla/core';

import WarningModal from '../../../WarningModal';

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
  > * {
    margin-right: ${spacing.small};
  }
`;

const EditMathModal = ({
  handleExit,
  handleSave,
  handleRemove,
  handleCancel,
  handleContinue,
  openDiscardModal,
  mathML,
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
            <Button outline onClick={previewMath}>
              {t('mathEditor.showPreview')}
            </Button>
            <Button outline onClick={() => handleSave(onCloseModal)}>
              {t('mathEditor.save')}
            </Button>
            <Button outline onClick={() => handleExit(onCloseModal)}>
              {t('mathEditor.cancel')}
            </Button>
            <Button outline onClick={() => handleRemove(onCloseModal)}>
              {t('mathEditor.remove')}
            </Button>
          </StyledButtonWrapper>
          <h3>{t('mathEditor.preview')}</h3>
          <hr />
          <StyledMathPreviewWrapper
            dangerouslySetInnerHTML={{
              __html: mathML,
            }}
          />
          <WarningModal
            show={openDiscardModal}
            text={t('mathEditor.continue')}
            actions={[
              {
                text: t('form.abort'),
                onClick: handleCancel,
              },
              {
                text: t('warningModal.continue'),
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
  mathML: PropTypes.string,
};

export default injectT(EditMathModal);
