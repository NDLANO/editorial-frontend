/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { ReactNode, useCallback, useMemo } from "react";
import { Editor } from "slate";
import { collisionDetection } from "./collisionDetection";
import { DND_PLUGIN, DndPluginOptions } from "./dndTypes";
import { onDragEnd } from "./onDragEnd";
import { SlateDragOverlay } from "./SlateDragOverlay";

interface Props {
  children: ReactNode;
  editor: Editor;
}

export const SlateDndContext = ({ children, editor }: Props) => {
  const dndOptions = useMemo(() => editor.getPluginOptions<DndPluginOptions>(DND_PLUGIN), [editor]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    // TODO: Consider implementing a custom keyboard sensor to handle keyboard events.
    // As of now we're relying on scrolling
    useSensor(KeyboardSensor),
  );

  const dragEnd = useCallback(
    (dragEvent: DragEndEvent) => onDragEnd(dragEvent, editor, dndOptions),
    [editor, dndOptions],
  );

  return (
    <DndContext sensors={sensors} collisionDetection={collisionDetection} onDragEnd={dragEnd}>
      {children}
      <SlateDragOverlay />
    </DndContext>
  );
};
