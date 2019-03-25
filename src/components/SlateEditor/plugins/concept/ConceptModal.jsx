import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import Modal from '@ndla/modal/lib/Modal';
import { ModalHeader, ModalBody } from '@ndla/modal';
import ModalCloseButton from '@ndla/modal/lib/ModalCloseButton';
import { injectT } from '@ndla/i18n';
import { toConcept } from '../../../../util/routeHelpers';

class ConceptModal extends React.PureComponent {
  render() {
    const { accessToken, id, onClose, t, createConcept } = this.props;
    return (
      <Modal
        narrow
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
                src={toConcept({
                  type: createConcept ? 'create' : 'edit',
                  id,
                  accessToken,
                })}
                title="concept"
                width="100%"
                height="100vh"
                css={iframeStyle}
              />
            </ModalBody>
          </>
        )}
      </Modal>
    );
  }
}

const iframeStyle = css`
  height: 100vh;
  border: none;
`;

ConceptModal.propTypes = {};

export default injectT(ConceptModal);
