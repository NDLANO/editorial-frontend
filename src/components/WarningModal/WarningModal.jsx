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
import styled, { css } from 'react-emotion';
import { spacing } from '@ndla/core';
import Lightbox from '../Lightbox';
import WarningModalFooter from './WarningModalFooter';

const StyledWarningModal = styled('div')`
  color: white;
  height: 100%;
  padding-top: ${spacing.normal};
  font-size: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledWarningModalBody = styled('div')`
  display: flex;
`;

const StyledWarningModalBodyText = styled('span')`
  width: 100%;
  display: inline-block;
  text-align: left;
`;

const warningModalBodyIconStyle = css`
  width: 27px;
  height: 27px;
  margin-right: ${spacing.small};
`;

const WarningModal = ({ text, onCancel, actions, component, show }) =>
  show ? (
    <Lightbox modal onClose={onCancel}>
      <StyledWarningModal>
        <StyledWarningModalBody>
          <Warning css={warningModalBodyIconStyle} />
          <StyledWarningModalBodyText>{text}</StyledWarningModalBodyText>
        </StyledWarningModalBody>
        <WarningModalFooter actions={actions} component={component} />
      </StyledWarningModal>
    </Lightbox>
  ) : null;

WarningModal.propTypes = {
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
};

export default WarningModal;
