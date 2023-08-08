/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalTitle,
  ModalTrigger,
  ModalContent,
} from '@ndla/modal';
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

interface Props {
  handleExit: () => void;
  handleSave?: () => void;
  handleRemove: () => void;
  handleCancelDiscard: () => void;
  handleContinue: () => void;
  openDiscardModal: boolean;
  renderMathML: string;
  previewMath?: () => void;
  id: string;
  editMode: boolean;
}

const EditMathModal = ({
  handleExit,
  handleSave,
  handleRemove,
  handleCancelDiscard,
  handleContinue,
  openDiscardModal,
  renderMathML,
  previewMath,
  editMode,
  id,
}: Props) => {
  const { t } = useTranslation();
  const uuid = useMemo(() => uniqueId(), []);
  useEffect(() => {
    const node = document.getElementById(uuid);
    if (node && window.MathJax) window.MathJax.typesetPromise([node]);
  }, [uuid, renderMathML]);

  return (
    <Modal open={editMode} onOpenChange={handleExit}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{t('mathEditor.editMath')}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <hr />
          <StyledMathEditorWrapper id={`mathEditorContainer-${id}`} />
          <StyledButtonWrapper>
            <ButtonV2 data-testid="preview-math" variant="outline" onClick={previewMath}>
              {t('form.preview.button')}
            </ButtonV2>
            <ButtonV2 data-testid="save-math" variant="outline" onClick={handleSave}>
              {t('form.save')}
            </ButtonV2>
            <ButtonV2 data-testid="abort-math" variant="outline" onClick={handleExit}>
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
            data-testid="preview-math-text"
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
      </ModalContent>
    </Modal>
  );
};

export default EditMathModal;
