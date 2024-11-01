/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, ReactElement, ReactNode, useCallback, useRef } from "react";
import { Warning } from "@ndla/icons/editor";
import {
  DialogRoot,
  DialogContent,
  DialogTitle,
  Button,
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

const ActionWrapper = styled("div", {
  base: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    marginBlockStart: "xsmall",
  },
  variants: {
    singleChild: {
      true: {
        justifyContent: "flex-end",
      },
    },
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
      onExitComplete={() => {
        focusedElementBeforeModalRef.current?.focus();
        focusedElementBeforeModalRef.current = null;
      }}
    >
      <StyledDialogContent data-testid="alert-dialog">
        <StyledDialogHeader noTitle={!title}>
          {title && <DialogTitle>{title}</DialogTitle>}
          <DialogCloseButton variant="clear" data-testid="closeAlert" />
        </StyledDialogHeader>
        <DialogBody>
          <StyledMessageBox variant={severity === "danger" ? "error" : severity}>
            <HStack gap="medium">
              <Warning />
              <Text>{text}</Text>
            </HStack>
          </StyledMessageBox>
        </DialogBody>
        <DialogFooter>{children}</DialogFooter>
      </StyledDialogContent>
    </DialogRoot>
  );
};
