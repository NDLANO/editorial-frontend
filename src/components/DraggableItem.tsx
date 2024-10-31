/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentProps, ReactElement, ReactNode, cloneElement, forwardRef } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconButtonV2 } from "@ndla/button";
import { IconButton, IconButtonProps } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

interface Props {
  children: ReactNode;
  dragHandle?: ReactElement<ComponentProps<typeof IconButtonV2>>;
  id: UniqueIdentifier;
  disabled?: boolean;
  index: number;
}

const StyledListElement = styled("li", {
  base: {
    listStyle: "none",
    display: "flex",
    alignItems: "center",
    "&[data-has-handle='false']": {
      cursor: "grab",
    },
  },
});

const DraggableItem = ({ id, index, children, dragHandle, disabled }: Props) => {
  const { attributes, setNodeRef, transform, transition, listeners, setActivatorNodeRef } = useSortable({
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

export const DragHandle = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, id, tabIndex = 0, variant = "clear", ...rest }, ref) => {
    return (
      <StyledDragHandle {...rest} tabIndex={tabIndex} variant={variant} ref={ref}>
        {children}
      </StyledDragHandle>
    );
  },
);

export default DraggableItem;
