import { injectT, tType } from '@ndla/i18n';
import React, { useState } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import Lightbox from '../../components/Lightbox';

interface Props {
  resource: string;
  onClose: () => void;
  isOpen: boolean;
  children: (setH5pFetchFail: (failed: boolean) => void) => React.ReactElement;
}

const h5pContentCss = css`
  padding: 0;
`;

const StyledVisualElementModal = styled(Modal)`
  overflow: hidden;
  .modal-body {
    height: 90%;
    h2 {
      margin-top: 0 !important;
    }
  }
`;

const VisualElementModalWrapper = ({ resource, children, onClose, isOpen, t }: Props & tType) => {
  const [h5pFetchFail, setH5pFetchFail] = useState(false);

  if (resource === 'h5p') {
    return (
      <Lightbox
        display={isOpen}
        appearance={'fullscreen'}
        onClose={onClose}
        hideCloseButton={!h5pFetchFail}
        contentCss={!h5pFetchFail ? h5pContentCss : undefined}>
        {children(setH5pFetchFail)}
      </Lightbox>
    );
  }
  return (
    <StyledVisualElementModal
      narrow
      controllable
      isOpen={isOpen}
      size="large"
      backgroundColor="white"
      onClose={onClose}>
      {(onCloseModal: () => void) => (
        <React.Fragment>
          <ModalHeader>
            <ModalCloseButton title={t('dialog.close')} onClick={onCloseModal} />
          </ModalHeader>
          <ModalBody>{children(setH5pFetchFail)}</ModalBody>
        </React.Fragment>
      )}
    </StyledVisualElementModal>
  );
};

export default injectT(VisualElementModalWrapper);
