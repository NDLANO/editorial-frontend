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
import { colors, spacing, stackOrder } from "@ndla/core";
import { Cross, TrashCanOutline } from "@ndla/icons/action";
import { CommentEmbedData, CommentMetaData } from "@ndla/types-embed";
import { Heading } from "@ndla/typography";
import CommentForm from "./CommentForm";
import { slateContentStyles } from "../../../../containers/ArticlePage/components/styles";

const CommentButton = styled.span`
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
  background-color: ${colors.white};
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  animation-duration: 300ms;
  animation-name: animateIn;
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};

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

const ContentWrapper = styled.div`
  div[data-radix-popper-content-wrapper] {
    z-index: ${stackOrder.popover} !important;
  }
`;

const BlockCommentWrapper = styled.div`
  border: 2px solid ${colors.support.yellowLight};
  cursor: pointer;
  &:focus,
  &:hover,
  &:active,
  &[data-open="true"] {
    border-color: ${colors.support.yellow};
  }
`;

const BlockComment = styled.div`
  ${slateContentStyles};
  background: ${colors.support.yellowLight};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 25px;
  &:focus,
  &:hover,
  &:active,
  &[data-open="true"] {
    background: ${colors.support.yellow};
  }
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
          <CommentButton role="button" tabIndex={0}>
            {children}
          </CommentButton>
        ) : (
          <BlockCommentWrapper contentEditable={false}>
            <BlockComment contentEditable={false}>{embed?.embedData?.text ?? ""}</BlockComment>
          </BlockCommentWrapper>
        )}
      </Trigger>
      <Portal>
        <ContentWrapper>
          <StyledContent className="PopoverContent" sideOffset={5}>
            <CommentHeader>
              <Heading headingStyle="h4" element="h1" margin="none">
                {t("taxonomy.comment")}
              </Heading>
              <div>
                <IconButtonV2
                  variant="ghost"
                  size="xsmall"
                  aria-label={t("form.workflow.deleteComment.title")}
                  title={t("form.workflow.deleteComment.title")}
                  onClick={() => onRemove()}
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
              onClose={() => {
                setIsOpen(false);
              }}
              labelText={t("form.workflow.updateComment")}
              labelVisuallyHidden
              commentType={commentType}
            />
            <StyledArrow />
          </StyledContent>
        </ContentWrapper>
      </Portal>
    </Root>
  );
};

export default CommentEmbed;
