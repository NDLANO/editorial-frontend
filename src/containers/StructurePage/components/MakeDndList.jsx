import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import BEMHelper from 'react-bem-helper';

const classes = new BEMHelper({
  name: 'dnd-list',
  prefix: 'c-',
});

const MakeDndList = ({ disableDnd, children, onDragEnd }) => (
  <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="droppable">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...classes('drop-zone', snapshot.isDraggingOver ? 'dragging' : '')}>
          {!disableDnd
            ? React.Children.map(children, (child, index) => (
                <Draggable key={this.id} draggableId={this.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}>
                      {child}
                    </div>
                  )}
                </Draggable>
              ))
            : children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
);

MakeDndList.propTypes = {
  disableDnd: PropTypes.bool,
  onDragEnd: PropTypes.func,
};

export default MakeDndList;
