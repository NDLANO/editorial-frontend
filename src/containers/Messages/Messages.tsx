/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT, tType } from '@ndla/i18n';
import styled from '@emotion/styled';
import { css, SerializedStyles } from '@emotion/core';
import { createBrowserHistory as createHistory } from 'history';
import { Dispatch } from 'redux';
import { clearMessage } from './messagesActions';
import { MessageShape } from '../../shapes';
import AlertModal from '../../components/AlertModal';
import { ReduxMessage } from './messagesSelectors';

const appearances: Record<string, SerializedStyles> = {
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
  z-index: 200;
  margin: 0 auto;
  ${(p: { appearance: 'hidden' | '' }) => appearances[p.appearance]};
`;

const getActions = (message: ReduxMessage, dispatch: Dispatch, t: tType['t']) => {
  if (message.type === 'auth0') {
    return [
      {
        text: t('form.abort'),
        onClick: () => dispatch(clearMessage(message.id)),
      },
      {
        text: t('alertModal.loginAgain'),
        onClick: async (evt: Event) => {
          evt.preventDefault();
          const lastPath = `${window.location.pathname}${
            window.location.search ? window.location.search : ''
          }`;
          localStorage.setItem('lastPath', lastPath);
          await createHistory().push('/logout/session?returnToLogin=true'); // Push to logoutPath
          window.location.reload();
        },
      },
    ];
  }
  return [];
};

interface MessageProps {
  message: ReduxMessage;
  dispatch: Dispatch;
}
export const Message = injectT(({ message, dispatch, t }: MessageProps & tType) => {
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
};

interface MessagesProps {
  messages: ReduxMessage[];
  dispatch: Dispatch;
}
export const Messages = ({ dispatch, messages }: MessagesProps) => {
  const isHidden = messages.length === 0;
  const timeoutMessage = (item: ReduxMessage) => {
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
