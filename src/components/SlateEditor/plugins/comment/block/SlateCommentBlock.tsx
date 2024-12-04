/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { Portal } from "@ark-ui/react";
import { MessageLine } from "@ndla/icons";
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  PopoverRoot,
  PopoverTrigger,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { CommentEmbedData, CommentMetaData } from "@ndla/types-embed";
import { TYPE_COMMENT_BLOCK } from "./types";
import { DialogCloseButton } from "../../../../DialogCloseButton";
import CommentForm from "../CommentForm";
import CommentPopoverPortal from "../CommentPopoverPortal";
import { CommentBlockElement } from "../interfaces";

const BlockCommentButton = styled("button", {
  base: {
    all: "unset",
    background: "surface.brand.4.subtle",
    cursor: "pointer",
    fontStyle: "italic",
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
    padding: "3xsmall",
    width: "100%",
    _hover: {
      background: "surface.brand.4",
    },
  },
});

const CommentText = styled(Text, {
  base: {
    width: "100%",
    lineClamp: "1",
  },
});

interface Props {
  attributes: RenderElementProps["attributes"];
  editor: Editor;
  element: CommentBlockElement;
  children: ReactNode;
}

const SlateCommentBlock = ({ attributes, editor, element, children }: Props) => {
  const { t } = useTranslation();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setModalOpen(!!element.isFirstEdit);
  }, [element.isFirstEdit]);

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
    <DialogRoot open={modalOpen} size="small" onOpenChange={(details) => onOpenChange(details.open)}>
      <Portal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("form.workflow.addComment.add")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <CommentForm
              initialData={embed?.embedData}
              onSave={onUpdateComment}
              onOpenChange={onOpenChange}
              labelText={t("form.workflow.addComment.label")}
              commentType="block"
            />
          </DialogBody>
        </DialogContent>
      </Portal>
      {!!embed && (
        <PopoverRoot open={popoverOpen} onOpenChange={(details) => setPopoverOpen(details.open)}>
          <PopoverTrigger asChild consumeCss type={undefined}>
            <BlockCommentButton type="button" contentEditable={false} {...attributes}>
              <MessageLine />
              <CommentText>{embed?.embedData?.text ?? ""}</CommentText>
            </BlockCommentButton>
          </PopoverTrigger>
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
        </PopoverRoot>
      )}
      {children}
    </DialogRoot>
  );
};

export default SlateCommentBlock;
