/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentProps, ReactElement, ReactNode, type Ref, cloneElement } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconButton, IconButtonProps } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

interface Props {
  children: ReactNode;
  dragHandle?: ReactElement<ComponentProps<typeof IconButton>>;
  id: UniqueIdentifier;
  disabled?: boolean;
  index: number;
}

const StyledListElement = styled("li", {
  base: {
    position: "relative",
    listStyle: "none",
    display: "flex",
    alignItems: "center",
    "&[data-has-handle='false']": {
      cursor: "grab",
    },
  },
  variants: {
    isDragging: {
      true: {
        zIndex: "docked",
      },
    },
  },
});

const DraggableItem = ({ id, index, children, dragHandle, disabled }: Props) => {
  const { attributes, setNodeRef, transform, transition, listeners, setActivatorNodeRef, isDragging } = useSortable({
    id: id,
    disabled,
    data: {
      index: index,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const clonedDragHandle = dragHandle
    ? cloneElement(dragHandle, {
        ...listeners,
        ref: setActivatorNodeRef,
        id: id.toString(),
        disabled,
      })
    : null;

  return (
    <StyledListElement
      ref={setNodeRef}
      data-has-handle={!!dragHandle}
      style={style}
      isDragging={isDragging}
      {...attributes}
      {...(dragHandle ? {} : listeners)}
    >
      {clonedDragHandle}
      {children}
    </StyledListElement>
  );
};

const StyledDragHandle = styled(IconButton, {
  base: {
    touchAction: "none",
    _disabled: {
      display: "none",
    },
  },
});

interface DragHandleProps extends IconButtonProps {
  ref?: Ref<HTMLButtonElement>;
}

export const DragHandle = ({ children, tabIndex = 0, variant = "clear", ...rest }: DragHandleProps) => {
  return (
    <StyledDragHandle {...rest} tabIndex={tabIndex} variant={variant}>
      {children}
    </StyledDragHandle>
  );
};

export default DraggableItem;
