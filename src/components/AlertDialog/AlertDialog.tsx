/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { DialogOpenChangeDetails, Portal } from "@ark-ui/react";
import { ErrorWarningLine } from "@ndla/icons";
import {
  DialogRoot,
  DialogContent,
  DialogTitle,
  Text,
  MessageBox,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@ndla/primitives";
import { MessageSeverity } from "../../interfaces";
import { DialogCloseButton } from "../DialogCloseButton";

interface Props {
  children: ReactNode;
  onCancel: () => void;
  title?: string;
  label: string;
  severity?: MessageSeverity;
  text: string;

  show?: boolean;
}

export const AlertDialog = ({ children, text, onCancel, title, show, label, severity = "danger" }: Props) => {
  const focusedElementBeforeModalRef = useRef<HTMLElement | null>(null);
  const { t } = useTranslation();

  const onOpenChange = useCallback(
    (details: DialogOpenChangeDetails) => {
      if (details.open) {
        focusedElementBeforeModalRef.current = document.activeElement as HTMLElement;
      } else {
        onCancel();
      }
    },
    [onCancel],
  );

  const onExitComplete = useCallback(() => {
    focusedElementBeforeModalRef.current?.focus();
    focusedElementBeforeModalRef.current = null;
  }, []);

  return (
    <DialogRoot
      open={!!show}
      onOpenChange={onOpenChange}
      aria-label={label}
      onExitComplete={onExitComplete}
      context="alert"
    >
      <Portal>
        <DialogContent data-testid="alert-dialog">
          <DialogHeader>
            <DialogTitle>{title ?? t("alertDialog.watchOut")}</DialogTitle>
            <DialogCloseButton variant="clear" data-testid="closeAlert" />
          </DialogHeader>
          <DialogBody>
            <MessageBox variant={severity === "danger" ? "error" : severity}>
              <ErrorWarningLine />
              <Text>{text}</Text>
            </MessageBox>
          </DialogBody>
          <DialogFooter>{children}</DialogFooter>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};
