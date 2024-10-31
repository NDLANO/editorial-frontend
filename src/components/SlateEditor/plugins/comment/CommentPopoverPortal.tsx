/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { Content, Arrow, Portal } from "@radix-ui/react-popover";
import { colors, spacing, animations, stackOrder } from "@ndla/core";
import { Cross, TrashCanOutline } from "@ndla/icons/action";
import { IconButton } from "@ndla/primitives";
import { CommentEmbedData, CommentMetaData } from "@ndla/types-embed";
import { Heading } from "@ndla/typography";
import CommentForm from "./CommentForm";

const StyledContent = styled(Content)`
  padding: ${spacing.normal};
  width: 500px;
  background-color: ${colors.white};
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  ${animations.fadeIn(animations.durations.fast)}
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  z-index: ${stackOrder.popover};
  &[data-state="closed"] {
    display: none;
  }
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${spacing.normal};
  border-bottom: 2px solid ${colors.brand.tertiary};
`;

const StyledArrow = styled(Arrow)`
  fill: ${colors.white};
`;

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
      <StyledContent onPointerDownOutside={() => (variant === "inline" ? onOpenChange(false) : null)}>
        <CommentHeader>
          <Heading headingStyle="h4" element="h1" margin="none">
            {t("form.comment.comment")}
          </Heading>
          <div>
            <IconButton
              variant="danger"
              size="small"
              aria-label={t("form.workflow.deleteComment.title")}
              title={t("form.workflow.deleteComment.title")}
              onClick={onDelete}
            >
              <TrashCanOutline />
            </IconButton>
            <IconButton
              variant="tertiary"
              size="small"
              aria-label={t("modal.closeModal")}
              title={t("modal.closeModal")}
              onClick={onClose}
            >
              <Cross />
            </IconButton>
          </div>
        </CommentHeader>
        <CommentForm
          initialData={embed?.embedData}
          onSave={onSave}
          onOpenChange={onOpenChange}
          labelText={t("form.workflow.updateComment")}
          labelVisuallyHidden
          commentType={variant}
        />
        <StyledArrow />
      </StyledContent>
    </Portal>
  );
};

export default CommentPopoverPortal;
