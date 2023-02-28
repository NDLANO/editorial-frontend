import { useTranslation } from 'react-i18next';
import { ReactElement } from 'react';
import styled from '@emotion/styled';
import { ModalHeader, ModalBody, ModalCloseButton, ModalV2 } from '@ndla/modal';

interface Props {
  resource: string;
  onClose: () => void;
  isOpen: boolean;
  children: ReactElement;
  label?: string;
}

const StyledModal = styled(ModalV2)`
  padding: 0;
  width: 100%;
  height: 100%;
  max-height: 95%;
  overflow: hidden;
`;

const StyledVisualElementModal = styled(ModalV2)`
  .modal-body {
    height: 90%;
    h2 {
      margin-top: 0 !important;
    }
  }
`;

const StyledModalBody = styled.div`
  display: flex;
  flex: 1;
`;

const VisualElementModalWrapper = ({ resource, children, onClose, isOpen, label }: Props) => {
  const { t } = useTranslation();

  if (resource === 'h5p') {
    return (
      <StyledModal controlled isOpen={isOpen} size="large" onClose={onClose}>
        {_ => <StyledModalBody>{children}</StyledModalBody>}
      </StyledModal>
    );
  }
  return (
    <StyledVisualElementModal
      controlled
      label={label}
      isOpen={isOpen}
      size="large"
      onClose={onClose}>
      {(onCloseModal: () => void) => (
        <>
          <ModalHeader>
            <ModalCloseButton title={t('dialog.close')} onClick={onCloseModal} />
          </ModalHeader>
          <ModalBody>{children}</ModalBody>
        </>
      )}
    </StyledVisualElementModal>
  );
};

export default VisualElementModalWrapper;
