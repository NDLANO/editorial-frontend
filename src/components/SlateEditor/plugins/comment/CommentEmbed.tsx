/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { Root, Trigger, Content, Arrow, Portal } from "@radix-ui/react-popover";
import { IconButtonV2 } from "@ndla/button";
import { colors, spacing, animations, stackOrder } from "@ndla/core";
import { Cross, TrashCanOutline } from "@ndla/icons/action";
import { Comment } from "@ndla/icons/common";
import { CommentEmbedData, CommentMetaData } from "@ndla/types-embed";
import { Text, Heading } from "@ndla/typography";
import CommentForm from "./CommentForm";

const InlineComment = styled.span`
  display: inline;
  span {
    background: ${colors.support.yellowLight};
    cursor: pointer;
    &:focus,
    &:hover,
    &:active,
    &[data-open="true"] {
      background: ${colors.support.yellow};
    }
  }
`;

const StyledContent = styled(Content)`
  padding: ${spacing.normal};
  min-width: 350px;
  max-width: 700px;
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

const StyledArrow = styled(Arrow)`
  fill: ${colors.white};
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${spacing.normal};
  border-bottom: 2px solid ${colors.brand.tertiary};
`;

const BlockCommentButton = styled.button`
  all: unset;
  background: ${colors.support.yellowLight};
  cursor: pointer;
  color: ${colors.brand.grey};
  font-style: italic;
  display: flex;
  align-items: center;
  gap: ${spacing.xsmall};
  padding: ${spacing.xxsmall} 0px ${spacing.xxsmall} ${spacing.xxsmall};
  width: 100%;
  &:focus,
  &:hover,
  &[data-open="true"] {
    background: ${colors.support.yellow};
  }
`;

const CommentText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: ${spacing.xxsmall};
`;

interface Props {
  embed: CommentMetaData;
  onSave: (data: CommentEmbedData) => void;
  onRemove: () => void;
  children?: ReactNode;
  commentType: "block" | "inline";
}

const CommentEmbed = ({ embed, onSave, children, onRemove, commentType }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  if (embed.status === "error") {
    return null;
  }

  return (
    <Root open={isOpen} onOpenChange={setIsOpen}>
      <Trigger asChild type={undefined}>
        {commentType === "inline" ? (
          <InlineComment role="button" tabIndex={0}>
            {children}
          </InlineComment>
        ) : (
          <BlockCommentButton type="button" contentEditable={false}>
            <Comment />
            <CommentText textStyle="button" margin="none">
              {embed?.embedData?.text ?? ""}
            </CommentText>
          </BlockCommentButton>
        )}
      </Trigger>
      <Portal>
        <StyledContent>
          <CommentHeader>
            <Heading headingStyle="h4" element="h1" margin="none">
              {t("form.comment.comment")}
            </Heading>
            <div>
              <IconButtonV2
                variant="ghost"
                size="xsmall"
                aria-label={t("form.workflow.deleteComment.title")}
                title={t("form.workflow.deleteComment.title")}
                onClick={onRemove}
                colorTheme="danger"
              >
                <TrashCanOutline />
              </IconButtonV2>
              <IconButtonV2
                variant="ghost"
                size="xsmall"
                aria-label={t("modal.closeModal")}
                title={t("modal.closeModal")}
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <Cross />
              </IconButtonV2>
            </div>
          </CommentHeader>
          <CommentForm
            initialData={embed.embedData}
            onSave={(data) => {
              setIsOpen(false);
              onSave(data);
            }}
            onOpenChange={setIsOpen}
            labelText={t("form.workflow.updateComment")}
            labelVisuallyHidden
            commentType={commentType}
          />
          <StyledArrow />
        </StyledContent>
      </Portal>
    </Root>
  );
};

export default CommentEmbed;
