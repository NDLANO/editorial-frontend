/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, ReactElement, useCallback, useRef } from "react";
import { Warning } from "@ndla/icons/editor";
import { DialogBody, DialogHeader, DialogRoot, DialogContent, DialogTitle, Button, Text } from "@ndla/primitives";
import { HStack, styled } from "@ndla/styled-system/jsx";
import { MessageSeverity } from "../../interfaces";
import { DialogCloseButton } from "../DialogCloseButton";

const StyledDialogBody = styled(DialogBody, {
  base: {
    gap: "medium",
    padding: "medium",
  },
  variants: {
    severity: {
      success: {
        backgroundColor: "surface.success",
      },
      info: {
        backgroundColor: "surface.infoSubtle",
      },
      warning: {
        backgroundColor: "surface.warning",
      },
      danger: {
        backgroundColor: "surface.danger",
      },
    },
  },
});

const ActionWrapper = styled("div", {
  base: {
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

export const AlertModal = ({
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
      <DialogContent>
        <StyledDialogBody severity={severity} data-testid="alert-modal">
          <DialogHeader>
            {title && <DialogTitle data-severity={severity}>{title}</DialogTitle>}
            <DialogCloseButton variant="clear" data-testid="closeAlert" />
          </DialogHeader>
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
        </StyledDialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
