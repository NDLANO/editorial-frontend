/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo, useState } from 'react';
import { uuid } from '@ndla/util';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from '@ndla/modal';
import { ButtonV2 } from '@ndla/button';
import AlertModal from '../../../../components/AlertModal';
import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';
import { Content } from '@radix-ui/react-popover';

const emptyMathTag = '<math xmlns="http://www.w3.org/1998/Math/MathML"/>';

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
`;

const StyledMenu = styled.span`
  display: flex;
  gap: ${spacing.xsmall};
  padding: ${spacing.xsmall};
  background-color: white;
  border: 1px solid ${colors.brand.greyLight};
`;

interface Props {
  model: {
    innerHTML?: string;
  };
  onExit: () => void;
  onSave: (val: string) => void;
  onRemove: () => void;
  isEditMode: boolean;
  onOpenChange: () => void;
}

interface MathML {
  getMathML: () => string;
  setMathML: (val: string) => void;
  insertInto: (val: HTMLElement | null) => void;
  focus: () => void;
}

const EditMath = ({
  model: { innerHTML },
  onExit,
  onRemove,
  onSave,
  isEditMode,
  onOpenChange,
}: Props) => {
  const [openDiscardModal, setOpenDiscardModal] = useState(false);
  const [renderedMathML, setRenderedMathML] = useState(innerHTML ?? emptyMathTag);
  const [mathEditor, setMathEditor] = useState<MathML | undefined>(undefined);
  const id = useMemo(() => uuid(), [uuid]);
  const {
    t,
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    if (isEditMode) {
      const script = document.createElement('script');
      script.src = 'https://www.wiris.net/client/editor/editor';
      script.onload = () => {
        setMathEditor(
          // @ts-ignore
          window.com.wiris.jsEditor.JsEditor.newInstance({
            language: ['nb', 'nn'].includes(language) ? 'no' : language,
          }),
        );
      };
      document.head.appendChild(script);
    }
  }, [language, isEditMode]);

  if (mathEditor) {
    mathEditor?.setMathML(renderedMathML ?? emptyMathTag);
    mathEditor?.insertInto(document.getElementById(`mathEditorContainer-${id}`));
    mathEditor?.focus();
  }

  useEffect(() => {
    const node = document.getElementById(id);
    if (node && window.MathJax) window.MathJax.typesetPromise([node]);
  }, [id, renderedMathML]);

  const handleExit = () => {
    if ((innerHTML ?? emptyMathTag) !== mathEditor?.getMathML()) {
      return setOpenDiscardModal(true);
    }
    return onExit();
  };

  return (
    <Modal>
      <Content>
        <StyledMenu>
          <ModalTrigger>
            <ButtonV2 variant="link" onClick={onOpenChange}>
              {t('form.edit')}
            </ButtonV2>
          </ModalTrigger>
          <ButtonV2 variant="link" onClick={onRemove}>
            {t('form.remove')}
          </ButtonV2>
        </StyledMenu>
      </Content>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{t('mathEditor.editMath')}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <hr />
          <StyledMathEditorWrapper id={`mathEditorContainer-${id}`} />
          <StyledButtonWrapper>
            <ButtonV2
              data-testid="preview-math"
              variant="outline"
              onClick={() => setRenderedMathML(mathEditor?.getMathML() ?? emptyMathTag)}
            >
              {t('form.preview.button')}
            </ButtonV2>
            <ButtonV2
              variant="outline"
              onClick={() => onSave(mathEditor?.getMathML() ?? emptyMathTag)}
            >
              {t('form.save')}
            </ButtonV2>
            <ButtonV2 data-testid="abort-math" variant="outline" onClick={handleExit}>
              {t('form.abort')}
            </ButtonV2>
            <ButtonV2 variant="outline" onClick={onRemove}>
              {t('form.remove')}
            </ButtonV2>
          </StyledButtonWrapper>
          <h3>{t('mathEditor.preview')}</h3>
          <hr />
          <StyledMathPreviewWrapper
            id={id}
            dangerouslySetInnerHTML={{
              __html: renderedMathML,
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
                onClick: () => setOpenDiscardModal(false),
              },
              {
                text: t('alertModal.continue'),
                onClick: onExit,
              },
            ]}
            onCancel={() => setOpenDiscardModal(false)}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditMath;
