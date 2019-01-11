/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import styled, { css } from 'react-emotion';
import { clearMessage } from './messagesActions';
import { MessageShape } from '../../shapes';
import WarningModal from '../../components/WarningModal';

const appearances = {
  hidden: css`
    display: none;
  `,
};

const StyledAlertOverlay = styled('div')`
  position: fixed;
  width: 80%;
  max-width: 800px;
  top: 50px;
  left: 0;
  right: 0;
  z-index: 100;
  margin: 0 auto;
  ${p => appearances[p.appearance]};
`;

export const Alert = injectT(({ message, dispatch, t }) => {
  return (
    <WarningModal
      show
      text={
        message.translationKey ? t(message.translationKey) : message.message
      }
      onCancel={() => dispatch(clearMessage(message.id))}
      severity={message.severity}
    />
  );
});

Alert.propTypes = {
  message: MessageShape.isRequired,
  dispatch: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export const Alerts = ({ dispatch, messages }) => {
  const isHidden = messages.length === 0;
  const timeoutMessage = item => {
    setTimeout(() => dispatch(clearMessage(item.id)), item.timeToLive);
  };

  messages.filter(m => m.timeToLive > 0).forEach(item => timeoutMessage(item));

  return (
    <StyledAlertOverlay appearance={isHidden ? 'hidden' : ''}>
      {messages.map(message => (
        <Alert key={message.id} dispatch={dispatch} message={message} />
      ))}
    </StyledAlertOverlay>
  );
};

Alerts.propTypes = {
  messages: PropTypes.arrayOf(MessageShape).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Alerts;
