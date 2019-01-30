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
import { HelpCircleDual } from '@ndla/icons/common';
import { css } from 'emotion';
import { colors } from '@ndla/core';
import { Trans } from '@ndla/i18n';

const dualIconCSS = css`
  #HelpCircleDual-background {
    fill: ${colors.brand.light};
  }
  #HelpCircleDual-symbol {
    fill: ${colors.brand.dark};
  }
  &:hover,
  &:focus {
    #HelpCircleDual-background {
      fill: ${colors.brand.primary};
    }
    #HelpCircleDual-symbol {
      fill: #fff;
    }
  }
`;
export const HelpMessage = ({ children }) => (
  <Trans>
    {({ t }) => (
      <Modal
        activateButton={
          <Button stripped tabIndex={-1} className={dualIconCSS}>
            <HelpCircleDual className="c-icon--22" />
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
