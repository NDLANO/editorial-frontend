/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement, useCallback } from "react";
import { DialogBody, DialogRoot, DialogContent, DialogHeader } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { DialogCloseButton } from "../../components/DialogCloseButton";

const StyledDialogContent = styled(DialogContent, {
  base: {
    overflow: "hidden",
  },
});

const StyledDialogHeader = styled(DialogHeader, {
  base: {
    justifyContent: "flex-end",
  },
});

interface Props {
  resource: string;
  onClose: () => void;
  isOpen: boolean;
  children: ReactElement;
  label?: string;
}

const VisualElementModalWrapper = ({ resource, children, onClose, isOpen, label }: Props) => {
  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onClose();
      }
    },
    [onClose],
  );

  if (resource === "h5p") {
    return (
      <DialogRoot size="large" open={isOpen} onOpenChange={(details) => onOpenChange(details.open)}>
        <StyledDialogContent>
          <DialogBody>{children}</DialogBody>
        </StyledDialogContent>
      </DialogRoot>
    );
  }

  return (
    <DialogRoot open={isOpen} size="large" onOpenChange={(details) => onOpenChange(details.open)}>
      <DialogContent aria-label={label}>
        <StyledDialogHeader>
          <DialogCloseButton />
        </StyledDialogHeader>
        <DialogBody>{children}</DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default VisualElementModalWrapper;
