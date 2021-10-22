import { uuid } from '@ndla/util';
import React, { createContext, useContext, useState } from 'react';
import { MessageType } from './NewMessages';

interface Props {
  children: React.ReactNode;
}
const MessagesContext = createContext<
  [MessageType[], React.Dispatch<React.SetStateAction<MessageType[]>>] | undefined
>(undefined);

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
      id: uuid(),
      ...newMessage,
      timeToLive: typeof newMessage.timeToLive === 'undefined' ? 1500 : newMessage.timeToLive,
    };
    setMessages(messages => [...messages, message]);
  };

  const clearMessage = (id: string) => setMessages(messages => messages.filter(m => m.id !== id));

  return {
    messages,
    createMessage,
    clearMessage,
  };
};
