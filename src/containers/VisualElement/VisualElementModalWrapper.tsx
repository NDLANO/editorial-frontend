/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ReactElement, useCallback } from 'react';
import styled from '@emotion/styled';
import { ModalHeader, ModalBody, ModalCloseButton, Modal, ModalContent } from '@ndla/modal';

interface Props {
  resource: string;
  onClose: () => void;
  isOpen: boolean;
  children: ReactElement;
  label?: string;
}

const StyledModalContent = styled(ModalContent)`
  padding: 0;
  width: 100% !important;
  height: 100%;
  max-height: 95%;
  overflow: hidden;
`;

const StyledVisualElementModalContent = styled(ModalContent)`
  h2 {
    margin-top: 0 !important;
  }
`;

const StyledModalBody = styled.div`
  display: flex;
  height: 100%;
`;

const VisualElementModalWrapper = ({ resource, children, onClose, isOpen, label }: Props) => {
  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onClose();
      }
    },
    [onClose],
  );

  if (resource === 'h5p') {
    return (
      <Modal open={isOpen} onOpenChange={onOpenChange}>
        <StyledModalContent size="large">
          <StyledModalBody>{children}</StyledModalBody>
        </StyledModalContent>
      </Modal>
    );
  }

  return (
    <Modal open={isOpen} onOpenChange={onOpenChange}>
      <StyledVisualElementModalContent aria-label={label} size="large">
        <ModalHeader>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </StyledVisualElementModalContent>
    </Modal>
  );
};

export default VisualElementModalWrapper;
