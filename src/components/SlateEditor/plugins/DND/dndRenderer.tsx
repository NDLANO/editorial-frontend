/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, ReactNode, useEffect } from "react";
import { Editor, Element, Node, ElementType, PathRef } from "slate";
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
  if (!parent || !Node.isElement(parent)) {
    return {
      accepts: undefined,
      pathRef: null,
    };
  }

  // We need to keep track of of the path of the element to determine whether we should show the top drop area.
  // Doing it through other means (useEffect, for instance), is too costly.
  // Remember to unref the pathref when unmounting the component that consumes it.
  const pathRef = editor.pathRef(path);

  return {
    accepts: options?.legalChildren?.[parent.type],
    pathRef,
  };
};

export const dndRenderer = (editor: Editor) => {
  const { renderElement } = editor;
  const dndOptions = editor.getPluginOptions<DndPluginOptions>(DND_PLUGIN);
  editor.renderElement = ({ attributes, children, element }) => {
    if (!element.id || dndOptions?.disabledElements?.includes(element.type)) {
      return renderElement?.({ attributes, children, element });
    }
    const { accepts, pathRef } = getAccepts(editor, element, dndOptions);
    if ((accepts && !accepts.length) || !pathRef) {
      return renderElement?.({ attributes, children, element });
    }

    return (
      <DraggableElement
        element={element}
        accepts={accepts}
        pathRef={pathRef}
        dragDisabled={editor.isDragDisabled?.(element)}
      >
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
  variants: {
    isDragging: {
      true: {
        "& [data-embed-wrapper]": {
          pointerEvents: "none",
        },
      },
    },
  },
});

interface Props {
  children: ReactNode;
  element: Element;
  accepts?: ElementType[];
  pathRef: PathRef;
  dragDisabled?: boolean;
}

const onMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
};

const DraggableElement = ({ children, element, accepts, pathRef, dragDisabled }: Props) => {
  const { attributes, listeners, active, setNodeRef } = useDraggable({
    id: element.id!,
    data: { element, children },
  });

  useEffect(() => {
    return () => {
      pathRef?.unref();
    };
  }, [pathRef]);

  return (
    <StyledContainer data-embed-wrapper="" data-drag-wrapper="" ref={setNodeRef} isDragging={!!active}>
      {pathRef?.current?.at(-1) === 0 && <DropArea element={element} accepts={accepts} position="top" />}
      {!dragDisabled && (
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
      )}
      {children}
      <DropArea element={element} accepts={accepts} position="bottom" />
    </StyledContainer>
  );
};
