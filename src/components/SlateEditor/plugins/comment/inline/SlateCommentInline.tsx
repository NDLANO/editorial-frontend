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
import { colors } from "@ndla/core";
import { CommentEmbedData, CommentMetaData } from "@ndla/types-embed";
import { TYPE_COMMENT_INLINE } from "./types";
import { InlineBugfix } from "../../../utils/InlineBugFix";
import CommentPopoverPortal from "../CommentPopoverPortal";
import { CommentInlineElement } from "../interfaces";

const InlineComment = styled.span`
  display: inline;
  background: ${colors.support.yellowLight};
  cursor: pointer;
  &:hover {
    background: ${colors.support.yellow};
  }
`;

interface Props {
  attributes: RenderElementProps["attributes"];
  editor: Editor;
  element: CommentInlineElement;
  children: ReactNode;
}

const SlateCommentInline = ({ attributes, editor, element, children }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(element.isFirstEdit);

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
    setOpen(false);
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
    setOpen(open);
    if (open === false) {
      if (!element.data?.text) {
        onRemove();
      } else {
        handleSelectionChange(false);
      }
    }
  };

  const preventAutoFocusInEditor = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      Transforms.select(editor, ReactEditor.findEventRange(editor, e));
    },
    [editor],
  );

  return (
    <Root open={open} onOpenChange={(v) => setOpen(v)}>
      <Trigger asChild type={undefined}>
        <InlineComment
          role="button"
          tabIndex={0}
          onMouseDown={(e) => preventAutoFocusInEditor(e.nativeEvent)}
          {...attributes}
        >
          <InlineBugfix />
          {children}
          <InlineBugfix />
        </InlineComment>
      </Trigger>
      <CommentPopoverPortal
        onSave={(data) => onUpdateComment(data)}
        embed={embed}
        onDelete={onRemove}
        onClose={() => onOpenChange(false)}
        onOpenChange={onOpenChange}
        variant="inline"
      />
    </Root>
  );
};

export default SlateCommentInline;
