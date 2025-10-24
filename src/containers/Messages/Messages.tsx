/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useHref, useLocation } from "react-router";
import { Button } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { useMessages } from "./MessagesProvider";
import { MessageType } from "./types";
import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { FormActionsContainer } from "../../components/FormikForm";
import { toLogout } from "../../util/routeHelpers";

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  const { t } = useTranslation();
  const { clearMessage } = useMessages();
  const location = useLocation();
  const href = useHref(location);

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
          <SafeLinkButton
            variant="secondary"
            to={toLogout(true, location.pathname !== "/" ? encodeURIComponent(href) : undefined)}
            asAnchor
          >
            {t("alertDialog.loginAgain")}
          </SafeLinkButton>
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
