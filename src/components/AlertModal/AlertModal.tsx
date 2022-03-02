/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement, MouseEvent } from 'react';
import { Warning } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { spacing } from '@ndla/core';
import AlertModalFooter from './AlertModalFooter';
import Lightbox from '../Lightbox';
import { MessageSeverity } from '../../interfaces';

const StyledAlertModal = styled('div')<{ severity: string }>`
  height: 100%;
  padding-top: ${spacing.normal};
  font-size: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledAlertModalBody = styled('div')`
  display: flex;
`;

const StyledAlertModalBodyText = styled('span')`
  width: 100%;
  display: inline-block;
  text-align: left;
`;

const alertModalBodyIconStyle = css`
  width: 27px;
  height: 27px;
  margin-right: ${spacing.small};
`;

interface Props {
  text: string;
  onCancel: () => void;
  component?: ReactElement[] | ReactElement;
  actions?: { text: string; onClick: (event: MouseEvent) => void; 'data-testid'?: string }[];
  show?: boolean;
  severity?: MessageSeverity;
}

const AlertModal = ({ text, onCancel, actions, component, show, severity = 'danger' }: Props) =>
  show ? (
    <Lightbox display={show} onClose={onCancel} appearance="modal" severity={severity}>
      <StyledAlertModal severity={severity}>
        <StyledAlertModalBody>
          <Warning css={alertModalBodyIconStyle} />
          <StyledAlertModalBodyText>{text}</StyledAlertModalBodyText>
        </StyledAlertModalBody>
        <AlertModalFooter actions={actions} component={component} />
      </StyledAlertModal>
    </Lightbox>
  ) : null;

export default AlertModal;
