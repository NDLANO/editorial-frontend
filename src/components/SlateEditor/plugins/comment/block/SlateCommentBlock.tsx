/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import styled from "@emotion/styled";
import { Root, Trigger } from "@radix-ui/react-popover";
import { ButtonV2 } from "@ndla/button";
import { colors, spacing } from "@ndla/core";
import { Comment } from "@ndla/icons/common";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle } from "@ndla/modal";
import { CommentEmbedData, CommentMetaData } from "@ndla/types-embed";
import { Text } from "@ndla/typography";
import { TYPE_COMMENT_BLOCK } from "./types";
import CommentForm from "../CommentForm";
import CommentPopoverPortal from "../CommentPopoverPortal";
import { CommentBlockElement } from "../interfaces";

const BlockCommentButton = styled(ButtonV2)`
  all: unset;
  background: ${colors.support.yellowLight};
  cursor: pointer;
  color: ${colors.brand.greyDark};
  font-style: italic;
  display: flex;
  align-items: center;
  gap: ${spacing.xsmall};
  padding: ${spacing.xxsmall} 0px ${spacing.xxsmall} ${spacing.xxsmall};
  margin: ${spacing.xxsmall} 0px;
  width: 100%;
  &:hover,
  &:focus {
    background: ${colors.support.yellow};
    color: ${colors.brand.greyDark};
  }
`;
const CommentText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: ${spacing.xxsmall};
`;

interface Props {
  attributes: RenderElementProps["attributes"];
  editor: Editor;
  element: CommentBlockElement;
  children: ReactNode;
}

const SlateCommentBlock = ({ attributes, editor, element, children }: Props) => {
  const { t } = useTranslation();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(element.isFirstEdit);

  const embed: CommentMetaData | undefined = useMemo(() => {
    if (!element.data) return undefined;
    return {
      status: "success",
      embedData: element.data,
      data: undefined,
      resource: "comment",
    };
  }, [element]);

  const onUpdateComment = useCallback(
    (values: CommentEmbedData) => {
      setModalOpen(false);
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(
        editor,
        { data: values, isFirstEdit: false },
        {
          at: path,
          match: (node) => Element.isElement(node) && node.type === TYPE_COMMENT_BLOCK,
        },
      );
    },
    [editor, element],
  );

  const onRemove = useCallback(
    () =>
      Transforms.unwrapNodes(editor, {
        at: ReactEditor.findPath(editor, element),
        voids: true,
      }),
    [editor, element],
  );

  const onOpenChange = useCallback(
    (open: boolean) => {
      setModalOpen(open);
      if (open === false) {
        ReactEditor.focus(editor);
        const path = ReactEditor.findPath(editor, element);
        if (Editor.hasPath(editor, Path.next(path))) {
          setTimeout(() => {
            Transforms.select(editor, Path.next(path));
          }, 0);
        }
      }
    },
    [editor, element],
  );

  return (
    <Modal open={modalOpen} onOpenChange={onOpenChange}>
      <ModalContent size="small">
        <ModalHeader>
          <ModalTitle>{t("form.workflow.addComment.add")}</ModalTitle>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <CommentForm
            initialData={embed?.embedData}
            onSave={onUpdateComment}
            onOpenChange={onOpenChange}
            labelText={t("form.workflow.addComment.label")}
            commentType="block"
          />
        </ModalBody>
      </ModalContent>
      {embed && (
        <Root open={popoverOpen} onOpenChange={setPopoverOpen}>
          <Trigger asChild type={undefined}>
            <BlockCommentButton variant="stripped" contentEditable={false} {...attributes}>
              <Comment />
              <CommentText textStyle="button" margin="none">
                {embed?.embedData?.text ?? ""}
              </CommentText>
            </BlockCommentButton>
          </Trigger>
          <CommentPopoverPortal
            onSave={(data) => {
              setPopoverOpen(false);
              onUpdateComment(data);
            }}
            embed={embed}
            onDelete={onRemove}
            onClose={() => setPopoverOpen(false)}
            onOpenChange={setPopoverOpen}
            variant="block"
          />
        </Root>
      )}
    </Modal>
  );
};

export default SlateCommentBlock;
