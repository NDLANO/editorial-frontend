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
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle } from "@ndla/modal";
import { CommentEmbedData, CommentMetaData } from "@ndla/types-embed";
import { TYPE_COMMENT_BLOCK } from "./types";
import CommentEmbed from "../CommentEmbed";
import CommentForm from "../CommentForm";
import { CommentBlockElement } from "../interfaces";

interface Props {
  attributes: RenderElementProps["attributes"];
  editor: Editor;
  element: CommentBlockElement;
  children: ReactNode;
}

const SlateCommentBlock = ({ attributes, editor, element, children }: Props) => {
  const { t } = useTranslation();
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
            commentType="block"
          />
        </ModalBody>
      </ModalContent>
      {embed && (
        <CommentEmbed embed={embed} onSave={onUpdateComment} onRemove={onRemove} commentType="block">
          {children}
        </CommentEmbed>
      )}
    </Modal>
  );
};

export default SlateCommentBlock;
