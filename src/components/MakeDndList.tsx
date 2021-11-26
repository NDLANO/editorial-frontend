import { Children, cloneElement, ReactElement } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd';
import BEMHelper from 'react-bem-helper';

const classes = new BEMHelper({
  name: 'dnd-list',
  prefix: 'c-',
});

interface Props {
  children: ReactElement[];
  disableDnd: boolean;
  onDragEnd: (result: DropResult, provided: ResponderProvided) => void;
  dragHandle: boolean;
}

const MakeDndList = ({ disableDnd, children, onDragEnd, dragHandle }: Props) => {
  if (disableDnd) {
    return <>{children}</>;
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...classes('drop-zone', snapshot.isDraggingOver ? 'dragging' : '')}>
            {Children.map(children, (child, index) => {
              if (!child) {
                return null;
              }
              return (
                <Draggable key={child.props.id} draggableId={child.props.id} index={index}>
                  {(providedInner, snapshotInner) => (
                    <div
                      ref={providedInner.innerRef}
                      {...providedInner.draggableProps}
                      {...(dragHandle ? {} : providedInner.dragHandleProps)}
                      {...classes('drag-item')}>
                      {cloneElement(child, {
                        isDragging: snapshotInner.isDragging,
                        dragHandleProps: providedInner.dragHandleProps,
                      })}
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default MakeDndList;
