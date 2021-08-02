/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Warning } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { spacing } from '@ndla/core';
import AlertModalFooter from './AlertModalFooter';
import Lightbox from '../Lightbox';

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
  component?: React.ReactElement[] | React.ReactElement;
  actions?: { text: string; onClick: Function }[];
  show?: boolean;
  severity?: string;
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

AlertModal.propTypes = {
  text: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  component: PropTypes.node,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      onClick: PropTypes.func,
    }),
  ),
  show: PropTypes.bool,
  severity: PropTypes.string,
};

export default AlertModal;
