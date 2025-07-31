/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useState } from "react";

import { useTranslation } from "react-i18next";
import { uuid } from "@ndla/util";
import { MessageType } from "./types";

interface Props {
  children?: ReactNode;
  initialValues?: MessageType[];
}
const MessagesContext = createContext<[MessageType[], Dispatch<SetStateAction<MessageType[]>>] | undefined>(undefined);

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

export interface NewMessageType extends Omit<MessageType, "id"> {
  id?: string;
}

const formatNewMessage = (newMessage: NewMessageType): MessageType => {
  return {
    ...newMessage,
    id: newMessage.id ?? uuid(),
    timeToLive: typeof newMessage.timeToLive === "undefined" ? 1500 : newMessage.timeToLive,
  };
};

export const MessagesProvider = ({ children, initialValues = [] }: Props) => {
  const messagesState = useState<MessageType[]>(initialValues);
  return <MessagesContext value={messagesState}>{children}</MessagesContext>;
};

export const useMessages = () => {
  const context = useContext(MessagesContext);
  const { t } = useTranslation();
  if (context === undefined) {
    throw new Error("useMessages can only be used witin a MessagesContext");
  }
  const [messages, setMessages] = context;

  const errorMessageFromError = useCallback(
    (error: MessageError): string => {
      const jsonMessage = error?.json?.messages?.map((message) => `${message.field}: ${message.message}`).join(", ");
      if (jsonMessage !== undefined) return jsonMessage;

      const errorMessages = error?.messages;
      if (errorMessages && typeof errorMessages === "string") return errorMessages;
      return t("errorMessage.genericError");
    },
    [t],
  );

  const formatErrorMessage = useCallback(
    (error: MessageError): NewMessageType => {
      return {
        message: errorMessageFromError(error),
        severity: "danger",
        timeToLive: 0,
      };
    },
    [errorMessageFromError],
  );

  const createMessage = useCallback(
    (newMessage: NewMessageType) => {
      const message = formatNewMessage(newMessage);
      setMessages((messages) => {
        if (!messages.some((msg) => msg.id === message.id)) {
          return messages.concat(message);
        } else {
          return messages;
        }
      });
    },
    [setMessages],
  );

  const createMessages = useCallback(
    (newMessages: NewMessageType[]) => {
      const formattedMessages = newMessages.map((newMessage) => formatNewMessage(newMessage));
      setMessages((messages) => [...messages, ...formattedMessages]);
    },
    [setMessages],
  );

  const applicationError = useCallback(
    (error: MessageError) => {
      const maybeMessages: MessageType[] | undefined = error.json?.messages?.map((m) => ({
        id: uuid(),
        message: `${m.field}: ${m.message}`,
        severity: "danger",
        timeToLive: 0,
      }));

      const newMessages = maybeMessages ?? [];

      if (newMessages.length === 0) {
        createMessage(formatErrorMessage(error));
      } else {
        createMessages(newMessages);
      }
    },
    [createMessage, createMessages, formatErrorMessage],
  );

  const clearMessage = useCallback(
    (id: string) => setMessages((prev) => prev.filter((m) => m.id !== id)),
    [setMessages],
  );
  const clearMessages = useCallback(() => setMessages([]), [setMessages]);

  return {
    messages,
    createMessage,
    clearMessage,
    clearMessages,
    applicationError,
    formatErrorMessage,
  };
};
