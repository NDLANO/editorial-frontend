/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
import { CommentMetaData } from "@ndla/types-embed";
import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import { DialogCloseButton } from "../../../../DialogCloseButton";
import { useEditableElement } from "../../../utils/useEditableElement";
import CommentForm from "../CommentForm";
import CommentPopoverPortal from "../CommentPopoverPortal";
import { CommentBlockElement } from "./types";

const BlockCommentButton = styled("button", {
  base: {
    all: "unset",
    background: "surface.brand.4",
    cursor: "pointer",
    fontStyle: "italic",
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
    padding: "3xsmall",
    width: "100%",
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
  const popover = useEditableElement(element, editor);
  const dialog = useEditableElement(element, editor);

  const embed: CommentMetaData | undefined = useMemo(() => {
    if (!element.data) return undefined;
    return {
      status: "success",
      embedData: element.data,
      data: undefined,
      resource: "comment",
    };
  }, [element]);

  return (
    <DialogRoot size="small" {...dialog.dialogProps}>
      <Portal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("form.workflow.addComment.add")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <CommentForm
              initialData={embed?.embedData}
              onSave={(data) => dialog.handleSave({ data })}
              onCancel={() => dialog.handleEditingChange(false)}
              labelText={t("form.workflow.addComment.label")}
              commentType="block"
            />
          </DialogBody>
        </DialogContent>
      </Portal>
      {!!embed && (
        <PopoverRoot {...popover.popoverProps}>
          <PopoverTrigger asChild consumeCss type={undefined}>
            <BlockCommentButton type="button" contentEditable={false} {...attributes}>
              <MessageLine />
              <CommentText>{embed?.embedData?.text ?? ""}</CommentText>
            </BlockCommentButton>
          </PopoverTrigger>
          <CommentPopoverPortal
            onSave={(data) => popover.handleSave({ data })}
            embed={embed}
            onDelete={popover.handleRemove}
            onClose={() => popover.handleEditingChange(false)}
            variant="block"
          />
        </PopoverRoot>
      )}
      {children}
    </DialogRoot>
  );
};

export default SlateCommentBlock;
