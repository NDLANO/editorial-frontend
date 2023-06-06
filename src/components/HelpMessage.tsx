/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { ModalBody, ModalCloseButton, ModalHeader, ModalTitle, Modal } from '@ndla/modal';
import Tooltip from '@ndla/tooltip';
import { ReactNode } from 'react';
import { CustomWithTranslation, withTranslation } from 'react-i18next';
import { HelpIcon } from './HowTo';

const StyledHelpIcon = styled(HelpIcon)`
  width: ${spacing.normal};
  height: ${spacing.normal};
  padding: 0;
`;

interface Props {
  children: ReactNode;
}

const HelpMessage = ({ children, t }: Props & CustomWithTranslation) => (
  <Modal
    wrapperFunctionForButton={(btn) => (
      <Tooltip tooltip={t('editMarkup.helpMessage.tooltip')}>{btn}</Tooltip>
    )}
    activateButton={
      <ButtonV2 variant="stripped">
        <StyledHelpIcon />
      </ButtonV2>
    }
  >
    {(onClose: () => void) => (
      <>
        <ModalHeader>
          <ModalTitle>{t('editMarkup.helpMessage.tooltip')}</ModalTitle>
          <ModalCloseButton onClick={onClose} title={t('dialog.close')} />
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </>
    )}
  </Modal>
);

export default withTranslation()(HelpMessage);
