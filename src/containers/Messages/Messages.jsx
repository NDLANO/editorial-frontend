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
import createHistory from 'history/createBrowserHistory';
import { clearMessage } from './messagesActions';
import { MessageShape } from '../../shapes';
import AlertModal from '../../components/AlertModal';

const appearances = {
  hidden: css`
    display: none;
  `,
};

const StyledMessageAlertOverlay = styled('div')`
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

const getActions = (message, dispatch, t) => {
  if (message.type === 'auth0') {
    return [
      { text: 'Avbryt', onClick: () => dispatch(clearMessage(message.id)) },
      {
        text: 'Logg ut',
        onClick: () => {
          createHistory().push('/logout/session'); // Push to logoutPath
          window.location.reload();
        },
      },
    ];
  }
  return [];
};

export const Message = injectT(({ message, dispatch, t }) => {
  return (
    <AlertModal
      show
      text={
        message.translationKey
          ? t(message.translationKey, message.translationObject)
          : message.message
      }
      actions={getActions(message, dispatch, t)}
      onCancel={() => dispatch(clearMessage(message.id))}
      severity={message.severity}
    />
  );
});

Message.propTypes = {
  message: MessageShape.isRequired,
  dispatch: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export const Messages = ({ dispatch, messages }) => {
  const isHidden = messages.length === 0;
  const timeoutMessage = item => {
    setTimeout(() => dispatch(clearMessage(item.id)), item.timeToLive);
  };

  messages.filter(m => m.timeToLive > 0).forEach(item => timeoutMessage(item));

  return (
    <StyledMessageAlertOverlay appearance={isHidden ? 'hidden' : ''}>
      {messages.map(message => (
        <Message key={message.id} dispatch={dispatch} message={message} />
      ))}
    </StyledMessageAlertOverlay>
  );
};

Messages.propTypes = {
  messages: PropTypes.arrayOf(MessageShape).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Messages;
