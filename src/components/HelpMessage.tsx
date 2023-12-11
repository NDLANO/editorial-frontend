/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import {
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalTitle,
  Modal,
  ModalTrigger,
  ModalContent,
} from '@ndla/modal';
import { HelpIcon } from './HowTo';

const StyledHelpIcon = styled(HelpIcon)`
  width: ${spacing.normal};
  height: ${spacing.normal};
  padding: 0;
`;

interface Props {
  children: ReactNode;
}

const HelpMessage = ({ children, t }: Props & WithTranslation) => (
  <Modal>
    <ModalTrigger>
      <ButtonV2
        variant="stripped"
        title={t('editMarkup.helpMessage.tooltip')}
        aria-label={t('editMarkup.helpMessage.tooltip')}
      >
        <StyledHelpIcon />
      </ButtonV2>
    </ModalTrigger>
    <ModalContent>
      <ModalHeader>
        <ModalTitle>{t('editMarkup.helpMessage.tooltip')}</ModalTitle>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>{children}</ModalBody>
    </ModalContent>
  </Modal>
);

export default withTranslation()(HelpMessage);
