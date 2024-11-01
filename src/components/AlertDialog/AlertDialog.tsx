/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, ReactElement, useCallback, useRef } from "react";
import { Warning } from "@ndla/icons/editor";
import { DialogRoot, DialogContent, DialogTitle, Button, Text, MessageBox } from "@ndla/primitives";
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

const HeaderWrapper = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
});

const StyledDialogContent = styled(DialogContent, {
  base: {
    borderRadius: "xsmall",
  },
});

interface Props {
  text: string;
  onCancel: () => void;
  title?: string;
  label: string;
  severity?: MessageSeverity;
  component?: ReactElement[] | ReactElement;
  actions?: {
    text: string;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    "data-testid"?: string;
  }[];
  show?: boolean;
}

export const AlertDialog = ({
  text,
  onCancel,
  title,
  component,
  show,
  label,
  severity = "danger",
  actions = [],
}: Props) => {
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
        <StyledMessageBox variant={severity === "danger" ? "error" : severity}>
          <HeaderWrapper>
            {title && <DialogTitle>{title}</DialogTitle>}
            <DialogCloseButton variant="clear" data-testid="closeAlert" />
          </HeaderWrapper>
          <HStack gap="medium">
            <Warning />
            <Text>{text}</Text>
          </HStack>
          {component ? (
            component
          ) : (
            <ActionWrapper singleChild={actions.length === 1}>
              {actions.map((action, id) => (
                <Button key={id} variant="secondary" onClick={action.onClick} data-testid={action["data-testid"]}>
                  {action.text}
                </Button>
              ))}
            </ActionWrapper>
          )}
        </StyledMessageBox>
      </StyledDialogContent>
    </DialogRoot>
  );
};
