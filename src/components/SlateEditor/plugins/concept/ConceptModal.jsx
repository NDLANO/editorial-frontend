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

  const [mode, setMode] = useState(id ? 'edit' : 'search');
  const iframeSrc = toConcept({
    id,
    accessToken,
    name,
    create: mode === 'create',
  });
  return (
    <Modal
      controllable
      isOpen={true}
      size="large"
      backgroundColor="white"
      minHeight="90vh">
      {() => (
        <div css={modalStyles}>
          <ModalHeader>
            <StyledHeader>
              {mode === 'search' && 'Legg til eksisterende begrep'}
              {mode === 'create' && 'Opprett nytt begrep'}
              {mode === 'edit' && 'Rediger begrep'}
            </StyledHeader>
            <ModalCloseButton title={t('dialog.close')} onClick={onClose} />
          </ModalHeader>
          <ModalBody>
            {mode === 'search' && (
              <StyledModalButtons>
                <span>{t('form.concept.addText')}</span>
                <Button
                  onClick={() => {
                    setMode('create');
                  }}>
                  {t('form.concept.create')}
                </Button>
              </StyledModalButtons>
            )}
            <iframe
              src={iframeSrc}
              title="concept"
              width="100%"
              css={iframeStyle}
            />
          </ModalBody>
        </div>
      )}
    </Modal>
  );
};

const iframeStyle = css`
  height: 95%;
  border: none;
`;

const StyledModalButtons = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  & > span {
    margin: 0 20px;
  }
`;

const StyledHeader = styled.h1`
  align-self: flex-start;
`;

const modalStyles = css`
  height: 90vh;

  & > .modal-body {
    height: 84vh;
  }

  & > .modal-header {
    height: 6vh;
  }
`;

ConceptModal.propTypes = {
  accessToken: PropTypes.string,
  id: PropTypes.number,
  onClose: PropTypes.func,
  handleMessage: PropTypes.func,
  name: PropTypes.string,
};

export default injectT(ConceptModal);
