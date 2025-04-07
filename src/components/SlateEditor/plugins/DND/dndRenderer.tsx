/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, ReactNode } from "react";
import { Editor, Element, ElementType } from "slate";
import { ReactEditor } from "slate-react";
import { useDraggable } from "@dnd-kit/core";
import { Draggable } from "@ndla/icons";
import { IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { DND_PLUGIN, DndPluginOptions } from "./dndTypes";
import { DropArea } from "./DropArea";

const getAccepts = (editor: Editor, element: Element, options?: DndPluginOptions) => {
  const path = ReactEditor.findPath(editor, element);
  const [parent] = editor.parent(path);
  if (!parent || !Element.isElement(parent)) {
    return {
      accepts: undefined,
      firstElementInContainer: false,
    };
  }
  return {
    accepts: options?.legalChildren?.[parent.type],
    firstElementInContainer: path.length === 2 ? path.at(1) === 0 : path.at(-1) === 0,
  };
};

export const dndRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  const dndOptions = editor.getPluginOptions<DndPluginOptions>(DND_PLUGIN);
  editor.renderElement = ({ attributes, children, element }) => {
    if (!element.id || dndOptions?.disabledElements?.includes(element.type)) {
      return renderElement?.({ attributes, children, element });
    }
    const { accepts, firstElementInContainer } = getAccepts(editor, element, dndOptions);
    if (accepts && !accepts.length) {
      return renderElement?.({ attributes, children, element });
    }
    return (
      <DraggableElement element={element} accepts={accepts} firstElementInContainer={firstElementInContainer}>
        {renderElement?.({ attributes, children, element })}
      </DraggableElement>
    );
  };

  return editor;
};

const StyledIconButton = styled(IconButton, {
  base: {
    touchAction: "none",
    position: "absolute",
    left: "-large",
    top: "50%",
    transform: "translateY(-50%)",
    visibility: "hidden",
    opacity: "0",
  },
});

const StyledContainer = styled("div", {
  base: {
    position: "relative",
    overflow: "visible",
    "&:not(:has([data-drag-wrapper]:hover)):hover": {
      "& > [data-drag-button]": {
        visibility: "visible",
        opacity: "1",
      },
    },
  },
});

interface Props {
  children: ReactNode;
  element: Element;
  accepts?: ElementType[];
  firstElementInContainer?: boolean;
}

const onMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
};

const DraggableElement = ({ children, element, accepts, firstElementInContainer }: Props) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: element.id!,
    data: { element, children },
  });

  return (
    <StyledContainer data-embed-wrapper="" data-drag-wrapper="" ref={setNodeRef}>
      {!!firstElementInContainer && <DropArea element={element} accepts={accepts} position="top" />}
      <StyledIconButton
        size="small"
        onMouseDown={onMouseDown}
        contentEditable={false}
        variant="clear"
        {...attributes}
        {...listeners}
        data-drag-button=""
      >
        <Draggable />
      </StyledIconButton>
      {children}
      <DropArea element={element} accepts={accepts} position="bottom" />
    </StyledContainer>
  );
};
