/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { RenderElementProps } from "slate-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Draggable } from "@ndla/icons";
import { IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import DropArea from "./DropArea";

const StyledDragHandle = styled(IconButton, {
  base: {
    touchAction: "none",
    position: "absolute",
    left: "-large",
    top: "50%",
    transform: "translateY(-50%)",
    opacity: "0",
  },
});

const StyledDndContainer = styled("div", {
  base: {
    position: "relative",
    _hover: {
      "& > [data-handle-wrapper] > [data-handle]": {
        opacity: "1",
      },
    },
  },
});

const StyledContent = styled("div", {
  base: {
    position: "relative",
  },
  variants: {
    isDragging: {
      true: {
        position: "relative",
        zIndex: "tooltip",
      },
      false: {},
    },
  },
});

interface Props {
  attributes: RenderElementProps["attributes"];
  children: ReactNode;
  elementId: string;
}

const DraggableContainer = ({ attributes: slateAttributes, children, elementId }: Props) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: elementId });
  return (
    <StyledDndContainer {...slateAttributes}>
      {!isDragging && <DropArea elementId={`${elementId}`} position="top" />}
      <StyledContent
        ref={setNodeRef}
        data-handle-wrapper=""
        style={{
          transform: CSS.Translate.toString(transform),
        }}
        isDragging={isDragging}
      >
        <StyledDragHandle size="small" variant="clear" data-handle="" {...attributes} {...listeners}>
          <Draggable />
        </StyledDragHandle>
        {children}
      </StyledContent>
      {!isDragging && <DropArea elementId={`${elementId}`} position="bottom" />}
    </StyledDndContainer>
  );
};
export default DraggableContainer;
