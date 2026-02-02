/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { IconButton } from "@ndla/primitives";
import { ComponentProps, ReactElement, useCallback, useEffect, useState } from "react";
import DraggableItem from "./DraggableItem";

interface Props<T extends { id: UniqueIdentifier }> {
  items: T[];
  disabled?: boolean;
  dragHandle?: ReactElement<ComponentProps<typeof IconButton>>;
  renderItem: (item: T, index: number) => ReactElement;
  onDragEnd: (event: DragEndEvent, items: T[]) => void;
}
const DndList = <T extends { id: UniqueIdentifier }>({
  items: _items,
  disabled,
  renderItem,
  onDragEnd,
  dragHandle,
}: Props<T>) => {
  const [items, setItems] = useState<T[]>(_items);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    setItems(_items);
  }, [_items]);

  const _onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over?.data.current && active.data.current) {
        const newArr = arrayMove(items, active.data.current.index, over.data.current.index);
        setItems(newArr);
        onDragEnd(event, newArr);
      }
    },
    [onDragEnd, items],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={_onDragEnd}
    >
      <SortableContext items={items} disabled={disabled} strategy={verticalListSortingStrategy}>
        {items.map((item, index) => (
          <DraggableItem disabled={disabled} key={item.id} id={item.id} index={index} dragHandle={dragHandle}>
            {renderItem(item, index)}
          </DraggableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default DndList;
