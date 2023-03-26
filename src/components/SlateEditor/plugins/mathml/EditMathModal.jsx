/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { useTranslation } from 'react-i18next';
import uniqueId from 'lodash/uniqueId';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import AlertModal from '../../../AlertModal';

const StyledMathEditorWrapper = styled.div`
  padding: ${spacing.small} 0;
  height: 40vh;
`;

const StyledMathPreviewWrapper = styled.div`
  padding: ${spacing.small} 0;
  display: flex;
  overflow: auto;
`;

const StyledButtonWrapper = styled.div`
  gap: ${spacing.small};
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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
  id,
}) => {
  const { t } = useTranslation();
  const uuid = useMemo(() => uniqueId(), []);
  useEffect(() => {
    const node = document.getElementById(uuid);
    if (node && window.MathJax) window.MathJax.typesetPromise([node]);
  }, [uuid, renderMathML]);
  return (
    <Modal
      label={t('mathEditor.editMath')}
      narrow
      controllable
      isOpen
      size="large"
      backgroundColor="white"
      onClose={handleExit}
      minHeight="90vh"
    >
      {onCloseModal => (
        <>
          <ModalHeader>
            <ModalCloseButton title={t('dialog.close')} onClick={onCloseModal} />
          </ModalHeader>
          <ModalBody>
            <h1>{t('mathEditor.editMath')}</h1>
            <hr />
            <StyledMathEditorWrapper id={`mathEditorContainer-${id}`} />
            <StyledButtonWrapper>
              <ButtonV2 variant="outline" onClick={previewMath}>
                {t('form.preview.button')}
              </ButtonV2>
              <ButtonV2 data-cy="save-math" variant="outline" onClick={handleSave}>
                {t('form.save')}
              </ButtonV2>
              <ButtonV2 variant="outline" onClick={onCloseModal}>
                {t('form.abort')}
              </ButtonV2>
              <ButtonV2 variant="outline" onClick={handleRemove}>
                {t('form.remove')}
              </ButtonV2>
            </StyledButtonWrapper>
            <h3>{t('mathEditor.preview')}</h3>
            <hr />
            <StyledMathPreviewWrapper
              id={uuid}
              dangerouslySetInnerHTML={{
                __html: renderMathML,
              }}
            />
            <AlertModal
              title={t('unsavedChanges')}
              label={t('unsavedChanges')}
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
};

EditMathModal.propTypes = {
  id: PropTypes.string.isRequired,
  handleExit: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleCancelDiscard: PropTypes.func.isRequired,
  handleContinue: PropTypes.func.isRequired,
  openDiscardModal: PropTypes.bool.isRequired,
  previewMath: PropTypes.func.isRequired,
  renderMathML: PropTypes.string,
};

export default EditMathModal;
