import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import BEMHelper from 'react-bem-helper';

const classes = new BEMHelper({
  name: 'dnd-list',
  prefix: 'c-',
});

const MakeDndList = ({ disableDnd, children, onDragEnd, dragHandle }) => {
  if (disableDnd) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...classes(
              'drop-zone',
              snapshot.isDraggingOver ? 'dragging' : '',
            )}>
            {React.Children.map(children, (child, index) => {
              if (!child) return null;
              return (
                <Draggable
                  key={child.props.id}
                  draggableId={child.props.id}
                  index={index}>
                  {(providedInner, snapshotInner) => (
                    <div
                      ref={providedInner.innerRef}
                      {...providedInner.draggableProps}
                      {...(dragHandle ? {} : providedInner.dragHandleProps)}
                      {...classes('drag-item')}>
                      {React.cloneElement(child, {
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

MakeDndList.propTypes = {
  disableDnd: PropTypes.bool,
  onDragEnd: PropTypes.func,
  dragHandle: PropTypes.bool,
};

export default MakeDndList;
