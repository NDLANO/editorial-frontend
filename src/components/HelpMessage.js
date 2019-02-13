/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import Button from '@ndla/button';
import Modal, { ModalCloseButton, ModalHeader, ModalBody } from '@ndla/modal';
import { Trans } from '@ndla/i18n';
import { HelpIcon } from './HowTo';

export const HelpMessage = ({ children }) => (
  <Trans>
    {({ t }) => (
      <Modal
        activateButton={
          <Button stripped tabIndex={-1}>
            <HelpIcon />
          </Button>
        }>
        {onClose => (
          <>
            <ModalHeader>
              <ModalCloseButton onClick={onClose} title={t('dialog.close')} />
            </ModalHeader>
            <ModalBody>{children}</ModalBody>
          </>
        )}
      </Modal>
    )}
  </Trans>
);
