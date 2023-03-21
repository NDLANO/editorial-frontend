import { uuid } from '@ndla/util';
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { MessageType } from './Messages';

interface Props {
  children?: ReactNode;
  initialValues?: MessageType[];
}
const MessagesContext = createContext<
  [MessageType[], Dispatch<SetStateAction<MessageType[]>>] | undefined
>(undefined);

export interface MessagesFunctions {
  messages: MessageType[];
  createMessage: (message: NewMessageType) => void;
  clearMessage: (id: string) => void;
  clearMessages: () => void;
  applicationError: (error: MessageError) => void;
}

export interface MessageError extends Partial<Error> {
  messages?: string;
  json?: {
    messages?: {
      field: string;
      message: string;
    }[];
  };
}

export interface NewMessageType extends Omit<MessageType, 'id'> {}

export const MessagesProvider = ({ children, initialValues = [] }: Props) => {
  const messagesState = useState<MessageType[]>(initialValues);
  return <MessagesContext.Provider value={messagesState}>{children}</MessagesContext.Provider>;
};

export const useMessages = () => {
  const context = useContext(MessagesContext);
  const { t } = useTranslation();
  if (context === undefined) {
    throw new Error('useMessages can only be used witin a MessagesContext');
  }
  const [messages, setMessages] = context;

  const formatNewMessage = (newMessage: NewMessageType): MessageType => {
    return {
      ...newMessage,
      id: uuid(),
      timeToLive: typeof newMessage.timeToLive === 'undefined' ? 1500 : newMessage.timeToLive,
    };
  };

  const errorMessageFromError = (error: MessageError): string => {
    const jsonMessage = error?.json?.messages
      ?.map(message => `${message.field}: ${message.message}`)
      .join(', ');
    if (jsonMessage !== undefined) return jsonMessage;

    const errorMessages = error?.messages;
    if (errorMessages && typeof errorMessages === 'string') return errorMessages;
    return t('errorMessage.genericError');
  };

  const formatErrorMessage = (error: MessageError): NewMessageType => {
    return {
      message: errorMessageFromError(error),
      severity: 'danger',
      timeToLive: 0,
    };
  };

  const createMessage = (newMessage: NewMessageType) => {
    const message = formatNewMessage(newMessage);
    setMessages(messages => [...messages, message]);
  };

  const createMessages = (newMessages: NewMessageType[]) => {
    const formattedMessages = newMessages.map(newMessage => formatNewMessage(newMessage));
    setMessages(messages => [...messages, ...formattedMessages]);
  };

  const applicationError = (error: MessageError) => {
    const maybeMessages: MessageType[] | undefined = error.json?.messages?.map(m => ({
      id: uuid(),
      message: `${m.field}: ${m.message}`,
      severity: 'danger',
      timeToLive: 0,
    }));

    const newMessages = maybeMessages ?? [];

    if (newMessages.length === 0) {
      createMessage(formatErrorMessage(error));
    } else {
      createMessages(newMessages);
    }
  };

  const clearMessage = (id: string) => setMessages(prev => prev.filter(m => m.id !== id));
  const clearMessages = () => setMessages([]);

  return {
    messages,
    createMessage,
    clearMessage,
    clearMessages,
    applicationError,
    formatErrorMessage,
  };
};
