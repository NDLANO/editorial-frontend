/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Editor, Element, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { PopoverRoot, PopoverTrigger } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { CommentEmbedData, CommentMetaData } from "@ndla/types-embed";
import { TYPE_COMMENT_INLINE } from "./types";
import { InlineBugfix } from "../../../utils/InlineBugFix";
import CommentPopoverPortal from "../CommentPopoverPortal";
import { CommentInlineElement } from "../interfaces";

const InlineComment = styled("span", {
  base: {
    display: "inline",
    background: "surface.brand.4",
    cursor: "pointer",
  },
});

interface Props {
  attributes: RenderElementProps["attributes"];
  editor: Editor;
  element: CommentInlineElement;
  children: ReactNode;
}

const SlateCommentInline = ({ attributes, editor, element, children }: Props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setOpen(!!element.isFirstEdit), 0);
    Transforms.select(editor, ReactEditor.findPath(editor, element));
  }, [editor, element, element.isFirstEdit]);

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
    <PopoverRoot
      open={open}
      onOpenChange={(details) => onOpenChange(details.open)}
      onInteractOutside={() => setOpen(false)}
    >
      <PopoverTrigger asChild type={undefined}>
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
      </PopoverTrigger>
      <CommentPopoverPortal
        onSave={(data) => onUpdateComment(data)}
        embed={embed}
        onDelete={onRemove}
        onClose={() => onOpenChange(false)}
        onOpenChange={onOpenChange}
        variant="inline"
      />
    </PopoverRoot>
  );
};

export default SlateCommentInline;
