/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useRef } from "react";
import { Portal } from "@ark-ui/react";
import { ErrorWarningLine } from "@ndla/icons/common";
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
import { HStack, styled } from "@ndla/styled-system/jsx";
import { MessageSeverity } from "../../interfaces";
import { DialogCloseButton } from "../DialogCloseButton";

const StyledMessageBox = styled(MessageBox, {
  base: {
    display: "flex",
    flexDirection: "column",
  },
});

const StyledDialogContent = styled(DialogContent, {
  base: {
    borderRadius: "xsmall",
  },
});

const StyledDialogHeader = styled(DialogHeader, {
  variants: {
    noTitle: {
      true: {
        justifyContent: "flex-end",
      },
    },
  },
});

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

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        focusedElementBeforeModalRef.current = document.activeElement as HTMLElement;
      } else {
        onCancel();
      }
    },
    [onCancel],
  );

  return (
    <DialogRoot
      open={!!show}
      onOpenChange={(details) => onOpenChange(details.open)}
      aria-label={label}
      context="alert"
      onExitComplete={() => {
        focusedElementBeforeModalRef.current?.focus();
        focusedElementBeforeModalRef.current = null;
      }}
    >
      <Portal>
        <StyledDialogContent data-testid="alert-dialog">
          <StyledDialogHeader noTitle={!title}>
            {title && <DialogTitle>{title}</DialogTitle>}
            <DialogCloseButton variant="clear" data-testid="closeAlert" />
          </StyledDialogHeader>
          <DialogBody>
            <StyledMessageBox variant={severity === "danger" ? "error" : severity}>
              <HStack gap="medium">
                <ErrorWarningLine />
                <Text>{text}</Text>
              </HStack>
            </StyledMessageBox>
          </DialogBody>
          <DialogFooter>{children}</DialogFooter>
        </StyledDialogContent>
      </Portal>
    </DialogRoot>
  );
};
