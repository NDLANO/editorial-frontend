import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Button from '@ndla/button';
import Modal from '@ndla/modal/lib/Modal';
import { ModalHeader, ModalBody } from '@ndla/modal';
import ModalCloseButton from '@ndla/modal/lib/ModalCloseButton';
import { injectT } from '@ndla/i18n';
import { toConcept } from '../../../../util/routeHelpers';

const ConceptModal = ({ accessToken, id, onClose, t, name, handleMessage }) => {
  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  });
  const [iframeSrc, setIframeSrc] = useState(
    toConcept({
      id,
      accessToken,
      name,
    }),
  );
  return (
    <Modal
      controllable
      isOpen={true}
      size="large"
      backgroundColor="white"
      minHeight="90vh">
      {() => (
        <>
          <ModalHeader>
            <ModalCloseButton title={t('dialog.close')} onClick={onClose} />
          </ModalHeader>
          <ModalBody>
            <iframe
              src={iframeSrc}
              title="concept"
              width="100%"
              css={iframeStyle}
            />
            <StyledModalButtons>
              <Button onClick={() => setIframeSrc(toConcept({ create: true }))}>
                {t('form.concept.create')}
              </Button>
            </StyledModalButtons>
          </ModalBody>
        </>
      )}
    </Modal>
  );
};

const iframeStyle = css`
  height: 75vh;
  border: none;
`;

const StyledModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
`;

ConceptModal.propTypes = {
  accessToken: PropTypes.string,
  id: PropTypes.number,
  onClose: PropTypes.func,
  handleMessage: PropTypes.func,
  name: PropTypes.string,
};

export default injectT(ConceptModal);
