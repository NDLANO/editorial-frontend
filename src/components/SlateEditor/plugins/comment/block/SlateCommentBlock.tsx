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
import { CloseButton } from "@ndla/button";
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle } from "@ndla/modal";
import { CommentEmbedData, CommentMetaData } from "@ndla/types-embed";
import { TYPE_COMMENT_BLOCK } from "./types";
import CommentEmbed from "../CommentEmbed";
import CommentForm from "../CommentForm";
import { CommentElement } from "../interfaces";

interface Props {
  attributes: RenderElementProps["attributes"];
  editor: Editor;
  element: CommentElement<"comment-block">;
  children: ReactNode;
}

const SlateCommentBlock = ({ attributes, editor, element, children }: Props) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(element.isFirstEdit);

  const embed: CommentMetaData = useMemo(() => {
    return {
      status: "success",
      embedData: element.data,
      data: undefined,
      resource: "comment",
    };
  }, [element]);

  const addComment = useCallback(
    (values: CommentEmbedData) => {
      setModalOpen(false);
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(
        editor,
        { data: values },
        {
          at: path,
          match: (node) => Element.isElement(node) && node.type === TYPE_COMMENT_BLOCK,
        },
      );
    },
    [editor, element],
  );

  const handleRemove = useCallback(
    () =>
      Transforms.unwrapNodes(editor, {
        at: ReactEditor.findPath(editor, element),
        voids: true,
      }),
    [editor, element],
  );

  const onClose = useCallback(() => {
    ReactEditor.focus(editor);
    setModalOpen(false);
    if (element.isFirstEdit) {
      Transforms.unwrapNodes(editor, {
        at: ReactEditor.findPath(editor, element),
        voids: true,
      });
    }
    const path = ReactEditor.findPath(editor, element);
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => {
        Transforms.select(editor, Path.next(path));
      }, 0);
    }
  }, [editor, element]);

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
            commentType="block"
          />
        </ModalBody>
      </ModalContent>
      <CommentEmbed embed={embed} onSave={addComment} onRemove={handleRemove} commentType="block">
        {children}
      </CommentEmbed>
    </Modal>
  );
};

export default SlateCommentBlock;
