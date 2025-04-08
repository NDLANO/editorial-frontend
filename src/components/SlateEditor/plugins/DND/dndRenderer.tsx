/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { Editor, Element } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Draggable } from "@ndla/icons";
import { IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { DND_PLUGIN, DndPluginOptions } from "./dndTypes";
import { DropArea } from "./DropArea";

export const dndRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  const dndOptions = editor.getPluginOptions<DndPluginOptions>(DND_PLUGIN);
  editor.renderElement = ({ attributes, children, element }) => {
    if (!element.id || dndOptions?.disabledElements?.includes(element.type)) {
      return renderElement?.({ attributes, children, element });
    }
    return (
      <DraggableElement element={element} options={dndOptions}>
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
  },
});

const StyledWrapper = styled("div", {
  base: {
    position: "relative",
  },
  variants: {
    dragging: {
      true: {
        zIndex: "base",
        opacity: "0.5",
      },
    },
  },
});

const StyledContainer = styled("div", {
  base: {
    position: "relative",
    overflow: "visible",
    "&:hover, &:focus-visible": {
      "& > [data-embed-wrapper] > button": {
        visibility: "visible",
      },
    },
  },
});

interface Props {
  children: ReactNode;
  element: Element;
  options?: DndPluginOptions;
}

const useAccepts = (element: Element, options?: DndPluginOptions) => {
  const editor = useSlateStatic();

  const [parent] = editor.parent(ReactEditor.findPath(editor, element));

  if (!parent || !Element.isElement(parent)) return undefined;

  // console.log(element, parent, options?.legalChildren?.[parent.type]);

  return options?.legalChildren?.[parent.type];
};

const DraggableElement = ({ children, element, options }: Props) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: element.id!,
    data: { element },
  });

  const accepts = useAccepts(element, options);

  if (options?.disabledElements?.includes(element.type) || (accepts && !accepts.length)) {
    return children;
  }

  return (
    <StyledContainer data-embed-wrapper="">
      {<DropArea element={element} accepts={accepts} position="top" />}
      <StyledWrapper
        data-embed-wrapper=""
        dragging={isDragging}
        style={{ transform: CSS.Translate.toString(transform) }}
        ref={setNodeRef}
      >
        <StyledIconButton
          size="small"
          onMouseDown={(e) => e.preventDefault()}
          variant="clear"
          {...attributes}
          {...listeners}
          data-drag-button=""
        >
          <Draggable />
        </StyledIconButton>
        {children}
      </StyledWrapper>
      {<DropArea element={element} accepts={accepts} position="bottom" />}
    </StyledContainer>
  );
};
