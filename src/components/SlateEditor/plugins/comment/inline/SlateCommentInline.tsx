/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle } from "@ndla/modal";
import { CommentEmbedData, CommentMetaData } from "@ndla/types-embed";
import { TYPE_COMMENT_INLINE } from "./types";
import CommentEmbed from "../CommentEmbed";
import CommentForm from "../CommentForm";
import { CommentInlineElement } from "../interfaces";

interface Props {
  attributes: RenderElementProps["attributes"];
  editor: Editor;
  element: CommentInlineElement;
  children: ReactNode;
}

const SlateCommentInline = ({ attributes, editor, element, children }: Props) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(element.isFirstEdit);

  const embed: CommentMetaData = useMemo(() => {
    return {
      status: "success",
      embedData: element.data,
      data: undefined,
      resource: "comment",
    };
  }, [element.data]);

  const handleSelectionChange = (isRemoved: boolean) => {
    ReactEditor.focus(editor);
    if (isRemoved) {
      Transforms.select(editor, ReactEditor.findPath(editor, element));
    } else {
      Transforms.select(editor, Path.next(ReactEditor.findPath(editor, element)));
      Transforms.collapse(editor, { edge: "start" });
    }
  };

  const onUpdateComment = (values: CommentEmbedData) => {
    setModalOpen(false);
    handleSelectionChange(false);
    if (element) {
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(
        editor,
        { data: values, isFirstEdit: false },
        {
          at: path,
          match: (node) => Element.isElement(node) && node.type === TYPE_COMMENT_INLINE,
        },
      );
    }
  };

  const onRemove = () => {
    handleSelectionChange(true);
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_COMMENT_INLINE,
    });
  };

  const onOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (open === false) {
      if (!element.data?.text) {
        onRemove();
      } else {
        handleSelectionChange(false);
      }
    }
  };

  return (
    <Modal open={modalOpen} onOpenChange={onOpenChange}>
      <ModalContent>
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
            commentType="inline"
          />
        </ModalBody>
      </ModalContent>
      <CommentEmbed
        embed={embed}
        onSave={onUpdateComment}
        onRemove={onRemove}
        commentType="inline"
        attributes={attributes}
      >
        {children}
      </CommentEmbed>
    </Modal>
  );
};

export default SlateCommentInline;
