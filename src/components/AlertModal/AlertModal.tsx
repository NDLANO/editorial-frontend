/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, ReactElement } from 'react';
import { Warning } from '@ndla/icons/editor';
import { css, SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';
import { ModalHeaderV2, ModalV2 } from '@ndla/modal';
import { IconButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import { Cross } from '@ndla/icons/action';
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

const IconButton = styled(IconButtonV2)`
  margin-left: auto;
  color: ${colors.white};
  justify-self: flex-end;
`;

const Header = styled(ModalHeaderV2)`
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

  return (
    <ModalV2 controlled isOpen={!!show} onClose={onCancel} label={label}>
      {close => (
        <StyledModalBody css={severities[severity]}>
          <Header>
            {title && <Heading>{title}</Heading>}
            <IconButton
              data-testid="closeAlert"
              variant="ghost"
              aria-label={t('close')}
              colorTheme="lighter"
              onClick={e => {
                e.preventDefault();
                close();
              }}>
              <Cross />
            </IconButton>
          </Header>
          <StyledBody>
            <StyledIcon />
            {text}
          </StyledBody>
          <AlertModalFooter actions={actions} component={component} />
        </StyledModalBody>
      )}
    </ModalV2>
  );
};

export default AlertModal;
