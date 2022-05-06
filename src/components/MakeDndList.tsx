import styled from '@emotion/styled';
import { Children, cloneElement, ReactElement } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd';

interface StyledDropZoneProps {
  dragging?: boolean;
}

const StyledDropZone = styled.div<StyledDropZoneProps>`
  background-color: ${p => p.dragging && '#ddd'};
`;

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
          <StyledDropZone ref={provided.innerRef} dragging={snapshot.isDraggingOver}>
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
                      {...(dragHandle ? {} : providedInner.dragHandleProps)}>
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
          </StyledDropZone>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default MakeDndList;
