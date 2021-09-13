/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import Tooltip from '@ndla/tooltip';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { HelpIcon, normalPaddingCSS } from '../../../components/HowTo';

const AudioFileInfoModal = () => {
  const { t } = useTranslation();

  return (
    <Modal
      backgroundColor="white"
      activateButton={
        <div>
          <Tooltip tooltip={t('form.audio.modal.label')}>
            <HelpIcon css={normalPaddingCSS} />
          </Tooltip>
        </div>
      }>
      {(onClose: () => void) => (
        <>
          <ModalHeader>
            <ModalCloseButton title={t('dialog.close')} onClick={onClose} />
          </ModalHeader>
          <ModalBody>
            <h1>{t('form.audio.modal.header')}</h1>
            <ul>
              <li>{t('form.audio.info.multipleFiles')}</li>
              <li>{t('form.audio.info.changeFile')}</li>
              <li>{t('form.audio.info.newLanguage')}</li>
            </ul>
          </ModalBody>
        </>
      )}
    </Modal>
  );
};

export default AudioFileInfoModal;
