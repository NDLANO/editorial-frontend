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
import { CloseButton } from "@ndla/button";
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle } from "@ndla/modal";
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

  const handleSelectionChange = (isNew: boolean) => {
    ReactEditor.focus(editor);
    if (isNew) {
      Transforms.select(editor, Path.next(ReactEditor.findPath(editor, element)));
      Transforms.collapse(editor, { edge: "start" });
    } else {
      Transforms.select(editor, ReactEditor.findPath(editor, element));
    }
  };

  const addComment = (values: CommentEmbedData) => {
    setModalOpen(false);
    handleSelectionChange(true);
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

  const handleRemove = () => {
    handleSelectionChange(false);
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_COMMENT_INLINE,
    });
  };

  const onClose = () => {
    if (!element.data?.text) {
      handleRemove();
    } else {
      handleSelectionChange(false);
    }
  };

  return (
    <Modal open={modalOpen} onOpenChange={setModalOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{t("form.workflow.addComment.add")}</ModalTitle>
          <CloseButton onClick={onClose} />
        </ModalHeader>
        <ModalBody>
          <CommentForm
            initialData={embed?.embedData}
            onSave={addComment}
            onClose={onClose}
            labelText={t("form.workflow.addComment.label")}
            commentType="inline"
          />
        </ModalBody>
      </ModalContent>
      <CommentEmbed embed={embed} onSave={addComment} onRemove={handleRemove} commentType="inline">
        {children}
      </CommentEmbed>
    </Modal>
  );
};

export default SlateCommentInline;
