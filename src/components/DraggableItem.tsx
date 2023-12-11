/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentProps, ReactElement, ReactNode, cloneElement, forwardRef } from 'react';
import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';

interface Props {
  children: ReactNode;
  dragHandle?: ReactElement<ComponentProps<typeof IconButtonV2>>;
  id: UniqueIdentifier;
  disabled?: boolean;
  index: number;
}

const StyledListElement = styled.li`
  list-style: none;
  margin: 0;
  display: flex;
  align-items: center;
  &[data-has-handle='false'] {
    cursor: grab;
  }
`;

const DraggableItem = ({ id, index, children, dragHandle, disabled }: Props) => {
  const { attributes, setNodeRef, transform, transition, listeners, setActivatorNodeRef } =
    useSortable({
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

const DragHandleButton = styled(IconButtonV2)`
  touch-action: none;
  :disabled {
    visibility: hidden;
  }
`;

export const DragHandle = forwardRef<HTMLButtonElement, ComponentProps<typeof IconButtonV2>>(
  (
    {
      children,
      id,
      tabIndex = 0,
      variant = 'ghost',
      colorTheme = 'light',
      size = 'small',
      ...rest
    },
    ref,
  ) => {
    return (
      <DragHandleButton
        {...rest}
        tabIndex={tabIndex}
        variant={variant}
        colorTheme={colorTheme}
        size={size}
        ref={ref}
      >
        {children}
      </DragHandleButton>
    );
  },
);

export default DraggableItem;
