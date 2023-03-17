/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IconButtonV2 } from '@ndla/button';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import Tooltip from '@ndla/tooltip';

import { useTranslation } from 'react-i18next';
import { HelpIcon, normalPaddingCSS } from '../../../components/HowTo';

const AudioFileInfoModal = () => {
  const { t } = useTranslation();

  return (
    <Modal
      label={t('form.audio.modal.header')}
      backgroundColor="white"
      wrapperFunctionForButton={(btn) => (
        <Tooltip tooltip={t('form.audio.modal.label')}>{btn}</Tooltip>
      )}
      activateButton={
        <IconButtonV2
          aria-label={t('form.audio.modal.label')}
          variant="stripped"
          colorTheme="light"
        >
          <HelpIcon css={normalPaddingCSS} />
        </IconButtonV2>
      }
    >
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
              <li>{t('form.audio.info.deleteFiles')}</li>
            </ul>
          </ModalBody>
        </>
      )}
    </Modal>
  );
};

export default AudioFileInfoModal;
