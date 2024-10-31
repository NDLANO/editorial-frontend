/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, ReactElement, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { spacing, colors } from "@ndla/core";
import { Cross } from "@ndla/icons/action";
import { Warning } from "@ndla/icons/editor";
import { ModalHeader, Modal, ModalContent } from "@ndla/modal";
import AlertModalFooter from "./AlertModalFooter";
import { MessageSeverity } from "../../interfaces";

const StyledModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
  padding: ${spacing.normal};

  &[data-severity="success"] {
    background-color: ${colors.support.green};
    color: ${colors.white};
  }
  &[data-severity="info"] {
    background-color: ${colors.white};
    color: ${colors.text.primary};
  }
  &[data-severity="warning"] {
    background-color: ${colors.support.yellow};
    color: ${colors.text.primary};
  }
  &[data-severity="danger"] {
    background-color: ${colors.support.red};
    color: ${colors.white};
  }
`;

const Header = styled(ModalHeader)`
  display: flex;
  padding: 0;
  justify-content: space-between;
  h1 {
    color: ${colors.white};
  }
`;

const Heading = styled.h1`
  flex: 1;
  margin: 0;
  color: ${colors.white};

  &[data-severity="info"] {
    color: ${colors.text.primary};
  }
  &[data-severity="warning"] {
    color: ${colors.text.primary};
  }
`;

const StyledBody = styled.div`
  display: flex;
  gap: ${spacing.small};
`;

const StyledIcon = styled(Warning)`
  width: 27px;
  height: 27px;
`;

const CloseButton = styled(IconButtonV2)`
  svg {
    color: ${colors.white};
    &[data-severity="info"] {
      color: ${colors.text.primary};
    }
    &[data-severity="warning"] {
      color: ${colors.text.primary};
    }
  }
  &:hover,
  &:focus,
  &:focus-within,
  &:focus-visible {
    background-color: ${colors.white};
    svg {
      color: ${colors.brand.primary};
    }
  }
`;

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

const AlertModal = ({ text, onCancel, title, actions, component, show, label, severity = "danger" }: Props) => {
  const { t } = useTranslation();
  const focusedElementBeforeModalRef = useRef<HTMLElement | null>(null);

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onCancel();
      }
    },
    [onCancel],
  );

  return (
    <Modal open={!!show} onOpenChange={onOpenChange} aria-label={label}>
      <ModalContent
        onOpenAutoFocus={() => {
          focusedElementBeforeModalRef.current = document.activeElement as HTMLElement;
        }}
        onCloseAutoFocus={() => {
          focusedElementBeforeModalRef.current?.focus();
          focusedElementBeforeModalRef.current = null;
        }}
      >
        <StyledModalBody data-severity={severity} data-testid="alert-modal">
          <Header>
            {title && <Heading data-severity={severity}>{title}</Heading>}
            <CloseButton
              data-testid="closeAlert"
              variant="ghost"
              aria-label={t("close")}
              colorTheme="lighter"
              onClick={(e) => {
                e.preventDefault();
                onCancel();
              }}
            >
              <Cross data-severity={severity} />
            </CloseButton>
          </Header>
          <StyledBody>
            <StyledIcon />
            {text}
          </StyledBody>
          <AlertModalFooter actions={actions} component={component} />
        </StyledModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AlertModal;
