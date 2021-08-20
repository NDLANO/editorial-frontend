/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { css } from '@emotion/core';
import { spacing } from '@ndla/core';
import Button from '@ndla/button';
import Modal, { ModalCloseButton, ModalHeader, ModalBody } from '@ndla/modal';
import Tooltip from '@ndla/tooltip';
import { useTranslation } from 'react-i18next';
import { HelpIcon } from './HowTo';

const iconCSS = css`
  width: ${spacing.normal};
  height: ${spacing.normal};
  padding: 0;
`;

export const HelpMessage = ({ children }) => {
  const {t} = useTranslation();
  return (
    <Modal
      activateButton={
        <Button stripped tabIndex={-1}>
          <Tooltip tooltip={t('editMarkup.helpMessage.tooltip')}>
            <HelpIcon css={iconCSS} />
          </Tooltip>
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
  );
}
