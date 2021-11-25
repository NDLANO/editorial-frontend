/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css, SerializedStyles } from '@emotion/core';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../../components/AlertModal';
import { useMessages } from './MessagesProvider';

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

type MessageSeverity = 'danger' | 'info' | 'success' | 'warning';

export interface MessageType {
  id: string;
  message?: string;
  translationKey?: string;
  translationObject?: {
    message?: string;
  };
  severity?: MessageSeverity;
  action?: string;
  timeToLive?: number;
  statusCode?: number;
  type?: string;
}

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clearMessage } = useMessages();

  const auth0Actions = [
    {
      text: t('form.abort'),
      onClick: () => clearMessage(message.id),
    },
    {
      text: t('alertModal.loginAgain'),
      onClick: (evt: Event) => {
        evt.preventDefault();
        const lastPath = `${window.location.pathname}${
          window.location.search ? window.location.search : ''
        }`;
        localStorage.setItem('lastPath', lastPath);
        navigate('/logout/session?returnToLogin=true'); // Push to logoutPath
        // window.location.reload();
      },
    },
  ];

  return (
    <AlertModal
      show
      text={
        message.translationKey
          ? t(message.translationKey, message.translationObject)
          : message.message!
      }
      actions={message.type === 'auth0' ? auth0Actions : []}
      onCancel={() => clearMessage(message.id)}
      severity={message.severity}
    />
  );
};

const Messages = () => {
  const { messages, clearMessage } = useMessages();
  const isHidden = messages.length === 0;
  const timeout = (item: MessageType) => setTimeout(() => clearMessage(item.id), item.timeToLive);
  messages.filter(m => (m.timeToLive ?? 1) > 0).forEach(item => timeout(item));
  return (
    <StyledMessageAlertOverlay appearance={isHidden ? 'hidden' : ''}>
      {messages.map(message => (
        <Message key={message.id} message={message} />
      ))}
    </StyledMessageAlertOverlay>
  );
};

export default Messages;
