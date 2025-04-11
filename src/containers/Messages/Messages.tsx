/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@ndla/primitives";
import { useMessages } from "./MessagesProvider";
import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { FormActionsContainer } from "../../components/FormikForm";

type MessageSeverity = "danger" | "info" | "success" | "warning";

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

  return (
    <AlertDialog
      title={t(`messages.severity.${message.severity ?? "danger"}`)}
      label={t(`messages.severity.${message.severity ?? "danger"}`)}
      show
      onCancel={() => clearMessage(message.id)}
      severity={message.severity}
      text={message.translationKey ? t(message.translationKey, message.translationObject) : message.message!}
    >
      {message.type === "auth0" ? (
        <FormActionsContainer>
          <Button variant="danger" onClick={() => clearMessage(message.id)}>
            {t("form.abort")}
          </Button>
          <Button
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              const lastPath = `${window.location.pathname}${window.location.search ? window.location.search : ""}`;
              localStorage.setItem("lastPath", lastPath);
              navigate("/logout/session?returnToLogin=true"); // Push to logoutPath
              window.location.reload();
            }}
          >
            {t("alertDialog.loginAgain")}
          </Button>
        </FormActionsContainer>
      ) : null}
    </AlertDialog>
  );
};

const Messages = () => {
  const { messages, clearMessage } = useMessages();
  const timeout = (item: MessageType) => setTimeout(() => clearMessage(item.id), item.timeToLive);
  messages.filter((m) => (m.timeToLive ?? 1) > 0).forEach((item) => timeout(item));
  return (
    <>
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </>
  );
};

export default Messages;
