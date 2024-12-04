/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Portal } from "@ark-ui/react";
import { CloseLine, DeleteBinLine } from "@ndla/icons";
import { IconButton, PopoverContent, PopoverTitle } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { CommentEmbedData, CommentMetaData } from "@ndla/types-embed";
import CommentForm from "./CommentForm";

const StyledPopoverContent = styled(PopoverContent, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    width: "surface.small",
  },
});

const CommentHeader = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "medium",
  },
});

const ButtonContainer = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
  },
});

interface Props {
  onSave: (data: CommentEmbedData) => void;
  embed: CommentMetaData | undefined;
  onDelete: () => void;
  onClose: () => void;
  onOpenChange: (v: boolean) => void;
  variant: "inline" | "block";
}

const CommentPopoverPortal = ({ onSave, embed, onDelete, onClose, onOpenChange, variant }: Props) => {
  const { t } = useTranslation();

  return (
    <Portal>
      <StyledPopoverContent>
        <CommentHeader>
          <PopoverTitle>{t("form.comment.comment")}</PopoverTitle>
          <ButtonContainer>
            <IconButton
              variant="danger"
              size="small"
              aria-label={t("form.workflow.deleteComment.title")}
              title={t("form.workflow.deleteComment.title")}
              onClick={onDelete}
            >
              <DeleteBinLine />
            </IconButton>
            <IconButton
              variant="tertiary"
              size="small"
              aria-label={t("modal.closeModal")}
              title={t("modal.closeModal")}
              onClick={onClose}
            >
              <CloseLine />
            </IconButton>
          </ButtonContainer>
        </CommentHeader>
        <CommentForm
          initialData={embed?.embedData}
          onSave={onSave}
          onOpenChange={onOpenChange}
          labelText={t("form.workflow.updateComment")}
          labelVisuallyHidden
          commentType={variant}
        />
      </StyledPopoverContent>
    </Portal>
  );
};

export default CommentPopoverPortal;
