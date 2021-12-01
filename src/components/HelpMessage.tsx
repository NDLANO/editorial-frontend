/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import { withTranslation, CustomWithTranslation } from 'react-i18next';
import { css } from '@emotion/core';
import { spacing } from '@ndla/core';
import Button from '@ndla/button';
import Modal, { ModalCloseButton, ModalHeader, ModalBody } from '@ndla/modal';
import Tooltip from '@ndla/tooltip';
import { HelpIcon } from './HowTo';

const iconCSS = css`
  width: ${spacing.normal};
  height: ${spacing.normal};
  padding: 0;
`;

interface Props {
  children: ReactNode;
}

const HelpMessage = ({ children, t }: Props & CustomWithTranslation) => (
  <Modal
    activateButton={
      <Button stripped tabIndex={-1}>
        <Tooltip tooltip={t('editMarkup.helpMessage.tooltip')}>
          <HelpIcon css={iconCSS} />
        </Tooltip>
      </Button>
    }>
    {(onClose: () => void) => (
      <>
        <ModalHeader>
          <ModalCloseButton onClick={onClose} title={t('dialog.close')} />
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </>
    )}
  </Modal>
);

export default withTranslation()(HelpMessage);
