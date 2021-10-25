import { uuid } from '@ndla/util';
import React, { createContext, useContext, useState } from 'react';
import { MessageType } from './Messages';

interface Props {
  children: React.ReactNode;
}
const MessagesContext = createContext<
  [MessageType[], React.Dispatch<React.SetStateAction<MessageType[]>>] | undefined
>(undefined);

export interface MessagesFunctions {
  messages: MessageType[];
  createMessage: (message: NewMessageType) => void;
  clearMessage: (id: string) => void;
  clearMessages: () => void;
  applicationError: (error: MessageError) => void;
}

export interface MessageError extends Partial<Error> {
  json?: {
    messages?: {
      field: string;
      message: string;
    }[];
  };
}

export interface NewMessageType extends Omit<MessageType, 'id'> {}

export const MessagesProvider = ({ children }: Props) => {
  const messagesState = useState<MessageType[]>([]);
  return <MessagesContext.Provider value={messagesState}>{children}</MessagesContext.Provider>;
};

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages can only be used witin a MessagesContext');
  }
  const [messages, setMessages] = context;

  const createMessage = (newMessage: NewMessageType) => {
    const message: MessageType = {
      ...newMessage,
      id: uuid(),
      timeToLive: typeof newMessage.timeToLive === 'undefined' ? 1500 : newMessage.timeToLive,
    };
    setMessages(messages => [...messages, message]);
  };

  const applicationError = (error: MessageError) => {
    const maybeMessages: MessageType[] | undefined = error.json?.messages?.map(m => ({
      id: uuid(),
      message: `${m.field}: ${m.message}`,
      severity: 'danger',
      timeToLive: 0,
    }));
    const newMessages = maybeMessages ?? [];
    setMessages(prevMessages => [...prevMessages, ...newMessages]);
  };

  const clearMessage = (id: string) => setMessages(messages => messages.filter(m => m.id !== id));
  const clearMessages = () => setMessages([]);

  return {
    messages,
    createMessage,
    clearMessage,
    clearMessages,
    applicationError,
  };
};
