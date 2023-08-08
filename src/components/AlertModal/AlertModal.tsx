/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, ReactElement, useCallback, useRef } from 'react';
import { Warning } from '@ndla/icons/editor';
import { css, SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';
import { ModalHeader, Modal, ModalContent } from '@ndla/modal';
import { IconButtonV2 } from '@ndla/button';
import { Cross } from '@ndla/icons/action';
import { useTranslation } from 'react-i18next';
import AlertModalFooter from './AlertModalFooter';
import { MessageSeverity } from '../../interfaces';

const severities: Record<string, SerializedStyles> = {
  success: css`
    background-color: ${colors.support.green};
    color: white;
  `,
  info: css`
    background-color: white;
    color: black;
  `,
  warning: css`
    background-color: ${colors.support.yellow};
    color: white;
  `,
  danger: css`
    background-color: ${colors.support.red};
    color: white;
  `,
};

const StyledModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
  padding: ${spacing.normal};
`;

const Header = styled(ModalHeader)`
  display: flex;
  padding: 0;
  justify-content: space-between;
  h1 {
    color: ${colors.white};
  }
`;

const Heading = styled.h1`
  flex: 1;
  margin: 0;
  color: ${colors.white};
`;

const StyledBody = styled.div`
  display: flex;
  gap: ${spacing.small};
`;

const StyledIcon = styled(Warning)`
  width: 27px;
  height: 27px;
`;

const CloseButton = styled(IconButtonV2)`
  svg {
    color: ${colors.white};
  }
  &:hover,
  &:focus,
  &:focus-within,
  &:focus-visible {
    background-color: ${colors.white};
    svg {
      color: ${colors.brand.primary};
    }
  }
`;

interface Props {
  text: string;
  onCancel: () => void;
  title?: string;
  label: string;
  severity?: MessageSeverity;
  component?: ReactElement[] | ReactElement;
  actions?: {
    text: string;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    'data-testid'?: string;
  }[];
  show?: boolean;
}

const AlertModal = ({
  text,
  onCancel,
  title,
  actions,
  component,
  show,
  label,
  severity = 'danger',
}: Props) => {
  const { t } = useTranslation();
  const focusedElementBeforeModalRef = useRef<HTMLElement | null>(null);

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onCancel();
      }
    },
    [onCancel],
  );

  return (
    <Modal open={!!show} onOpenChange={onOpenChange} aria-label={label}>
      <ModalContent
        onOpenAutoFocus={() => {
          focusedElementBeforeModalRef.current = document.activeElement as HTMLElement;
        }}
        onCloseAutoFocus={() => {
          focusedElementBeforeModalRef.current?.focus();
          focusedElementBeforeModalRef.current = null;
        }}
      >
        <StyledModalBody css={severities[severity]}>
          <Header>
            {title && <Heading>{title}</Heading>}
            <CloseButton
              data-testid="closeAlert"
              variant="ghost"
              aria-label={t('close')}
              colorTheme="lighter"
              onClick={(e) => {
                e.preventDefault();
                onCancel();
              }}
            >
              <Cross />
            </CloseButton>
          </Header>
          <StyledBody>
            <StyledIcon />
            {text}
          </StyledBody>
          <AlertModalFooter actions={actions} component={component} />
        </StyledModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AlertModal;
