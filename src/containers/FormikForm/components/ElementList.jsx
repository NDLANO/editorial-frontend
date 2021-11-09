/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { spacing, spacingUnit, shadows } from '@ndla/core';
import { ContentResultShape, LocaleShape } from '../../../shapes';
import ElementListItem from './ElementListItem';
import ElementListLink from './ElementListLink';

const ELEMENT_HEIGHT = 69;

const StyledWrapper = styled.div`
  margin: ${spacing.normal} 0;
`;

const StyledList = styled.ul`
  overflow: visible;
  margin: 0 0
    ${props => (props.draggingIndex === -1 ? 0 : `${ELEMENT_HEIGHT + spacingUnit * 0.75}px`)};
  padding: 0;
  position: relative;
  list-style: none;
`;

class ElementList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draggingIndex: -1,
      deleteIndex: -1,
    };
    this.wrapperRef = React.createRef();
  }

  deleteFile = deleteIndex => {
    this.setState({
      deleteIndex,
    });
  };

  executeDeleteFile = () => {
    const { elements, onUpdateElements } = this.props;
    this.deleteFile(-1);
    const newElements = elements.filter((element, i) => i !== this.state.deleteIndex);
    onUpdateElements(newElements);
  };

  updateTransforms = dragIndex => {
    Array.from(this.wrapperRef.current.childNodes.values()).forEach((node, index) => {
      if (index !== this.initialPosition) {
        const value = index >= dragIndex ? ELEMENT_HEIGHT : 0;
        node.style.transform = `translateY(${value}px)`;
      }
    });
  };

  onDragStart = (evt, dragIndex) => {
    evt.preventDefault();
    this.mouseMovement = -ELEMENT_HEIGHT + dragIndex * ELEMENT_HEIGHT;
    this.initialPosition = dragIndex;

    this.updateTransforms(dragIndex);

    this.DraggingFile = this.wrapperRef.current.childNodes[dragIndex];
    this.DraggingFile.style.width = `${this.DraggingFile.getBoundingClientRect().width}px`;
    this.DraggingFile.style.position = 'absolute';
    this.DraggingFile.style.top = 0;
    this.DraggingFile.style.zIndex = 9999;
    this.DraggingFile.style.boxShadow = shadows.levitate1;
    this.DraggingFile.style.transform = `translateY(${this.mouseMovement + ELEMENT_HEIGHT}px)`;

    this.setState(
      {
        draggingIndex: dragIndex,
      },
      () => {
        // Add transitions
        Array.from(this.wrapperRef.current.childNodes.values()).forEach(node => {
          node.style.transition = 'transform 100ms ease';
        });
        this.DraggingFile.style.transition = 'box-shadow 100ms ease';
      },
    );

    window.addEventListener('mousemove', this.onDragging);
    window.addEventListener('mouseup', this.onDragEnd);
  };

  onDragEnd = () => {
    window.removeEventListener('mousemove', this.onDragging);
    window.removeEventListener('mouseup', this.onDragEnd);
    const { elements, onUpdateElements } = this.props;
    // Rearrange elements
    const elementToMove = elements[this.initialPosition];
    const toIndex = this.state.draggingIndex;

    const newElements = [...elements];
    newElements.splice(this.initialPosition, 1);
    newElements.splice(toIndex, 0, elementToMove);
    this.setState({ draggingIndex: -1 });
    onUpdateElements(newElements);

    this.deleteFile(-1);

    Array.from(this.wrapperRef.current.childNodes.values()).forEach(node => {
      node.style.transition = 'none';
      node.style.transform = 'none';
    });

    this.DraggingFile.style.width = 'auto';
    this.DraggingFile.style.position = 'static';
    this.DraggingFile.style.zIndex = 0;
    this.DraggingFile.style.boxShadow = 'none';
  };

  onDragging = evt => {
    this.mouseMovement += evt.movementY;
    const currentPosition = Math.max(
      Math.ceil((this.mouseMovement + ELEMENT_HEIGHT / 2) / ELEMENT_HEIGHT),
      0,
    );
    const addToPosition = this.initialPosition < currentPosition ? 1 : 0;
    const dragIndex = Math.min(this.props.elements.length, Math.max(currentPosition, 0));
    this.DraggingFile.style.transform = `translateY(${this.mouseMovement + ELEMENT_HEIGHT}px)`;
    this.updateTransforms(dragIndex + addToPosition);
    this.setState(prevState => {
      if (prevState.draggingIndex !== dragIndex) {
        return {
          draggingIndex: dragIndex,
        };
      }
    });
  };

  render() {
    const { isEditable, isOrderable, elements, messages } = this.props;
    const { draggingIndex, deleteIndex } = this.state;
    return (
      <StyledWrapper>
        <StyledList ref={this.wrapperRef} draggingIndex={draggingIndex}>
          {elements
            .filter(element => !!element)
            .map((element, index) => {
              if (element.id || !(element.url && element.title)) {
                return (
                  <ElementListItem
                    key={element.id}
                    isEditable={isEditable}
                    isOrderable={isOrderable}
                    element={element}
                    deleteIndex={deleteIndex}
                    messages={messages}
                    index={index}
                    locale={this.props.i18n.language}
                    executeDeleteFile={this.executeDeleteFile}
                    showDragTooltip={elements.length > 1 && draggingIndex === -1}
                    onDragEnd={this.onDragEnd}
                    onDragStart={this.onDragStart}
                    deleteFile={this.deleteFile}
                  />
                );
              } else {
                return (
                  <ElementListLink
                    key={element.title + element.url}
                    isEditable={isEditable}
                    isOrderable={isOrderable}
                    element={element}
                    deleteIndex={deleteIndex}
                    messages={messages}
                    index={index}
                    locale={this.props.i18n.language}
                    executeDeleteFile={this.executeDeleteFile}
                    showDragTooltip={elements.length > 1 && draggingIndex === -1}
                    onDragEnd={this.onDragEnd}
                    onDragStart={this.onDragStart}
                    deleteFile={this.deleteFile}
                  />
                );
              }
            })}
        </StyledList>
      </StyledWrapper>
    );
  }
}

ElementList.propTypes = {
  elements: PropTypes.arrayOf(ContentResultShape),
  isEditable: PropTypes.bool,
  isOrderable: PropTypes.bool,
  messages: PropTypes.shape({
    removeElement: PropTypes.string,
    dragElement: PropTypes.string,
  }),
  onUpdateElements: PropTypes.func,
  i18n: PropTypes.shape({
    language: LocaleShape.isRequired,
  }).isRequired,
};

ElementList.defaultProps = {
  elements: [],
  isEditable: true,
  isOrderable: true,
};

export default withTranslation()(ElementList);
