/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PopoverRoot, PopoverTrigger } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { CommentMetaData } from "@ndla/types-embed";
import { InlineTriggerButton } from "@ndla/ui";
import { ReactNode, useMemo } from "react";
import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import { InlineBugfix } from "../../../utils/InlineBugFix";
import { useEditableElement } from "../../../utils/useEditableElement";
import CommentPopoverPortal from "../CommentPopoverPortal";
import { CommentInlineElement } from "./types";

const InlineComment = styled(InlineTriggerButton, {
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
  const { handleEditingChange, handleUnwrap, handleSave, popoverProps } = useEditableElement(element, editor, {
    unwrapOnAutoRemove: true,
  });

  const embed: CommentMetaData = useMemo(() => {
    return {
      status: "success",
      embedData: element.data,
      data: undefined,
      resource: "comment",
    };
  }, [element.data]);

  return (
    <PopoverRoot {...popoverProps}>
      <PopoverTrigger asChild type={undefined} {...attributes}>
        <InlineComment>
          <InlineBugfix />
          {children}
          <InlineBugfix />
        </InlineComment>
      </PopoverTrigger>
      <CommentPopoverPortal
        onSave={(data) => handleSave({ data })}
        embed={embed}
        onDelete={handleUnwrap}
        onClose={() => handleEditingChange(false)}
        variant="inline"
      />
    </PopoverRoot>
  );
};

export default SlateCommentInline;
