/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MutableRefObject, MouseEvent as ReactMouseEvent, createRef } from 'react';
import { useTranslation } from 'react-i18next';

import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { colors, spacing, spacingUnit, shadows } from '@ndla/core';
import { DeleteForever, DragHorizontal } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';
import { Node } from '@ndla/types-taxonomy';

const ELEMENT_HEIGHT = 69;

interface NodeListProps {
  draggingIndex: number;
}

const NodeListWrapper = styled.ul<NodeListProps>`
  overflow: visible;
  margin: 0 0
    ${(props) => (props.draggingIndex === -1 ? 0 : `${ELEMENT_HEIGHT + spacingUnit * 0.75}px`)};
  padding: 0;
  position: relative;
  list-style: none;
`;

const NodeWrapper = styled.li`
  align-items: center;
  background: ${colors.brand.greyLighter};
  display: flex;
  justify-content: space-between;
  margin: ${spacing.xxsmall};
  padding: ${spacing.xxsmall};
  padding-left: ${spacing.small};
`;

const ActionsContainer = styled.div`
  display: flex;
`;

const DraggableIconButton = styled(IconButtonV2)`
  cursor: grabbing;
`;

interface Props {
  nodes: Node[];
  nodeSet: string;
  onUpdate: Function;
}

const NodeList = ({ nodes, nodeSet, onUpdate }: Props) => {
  const { t } = useTranslation();
  let deleteIndex: number = -1;
  let draggingNode: HTMLLIElement | undefined;
  let draggingIndex: number = -1;
  let initialPosition: number = -1;
  let mouseMovement: number = 0;
  let wrapperRef: MutableRefObject<HTMLUListElement | null> = createRef();

  const updateTransforms = (dragIndex: number) => {
    const childNodes = wrapperRef.current?.childNodes as NodeListOf<HTMLLIElement> | undefined;
    childNodes?.forEach((node, index) => {
      if (index !== initialPosition) {
        const value = index >= dragIndex ? ELEMENT_HEIGHT : 0;
        node.style.transform = `translateY(${value}px)`;
      }
    });
  };

  const onDragging = (e: MouseEvent) => {
    mouseMovement += e.movementY;
    const currentPosition = Math.max(
      Math.ceil((mouseMovement + ELEMENT_HEIGHT / 2) / ELEMENT_HEIGHT),
      0,
    );
    const addToPosition = initialPosition < currentPosition ? 1 : 0;
    const dragIndex = Math.min(nodes.length, Math.max(currentPosition, 0));
    if (draggingNode) {
      draggingNode.style.transform = `translateY(${mouseMovement + ELEMENT_HEIGHT}px)`;
    }
    updateTransforms(dragIndex + addToPosition);
    if (draggingIndex !== dragIndex) {
      draggingIndex = dragIndex;
    }
  };

  const onDragStart = (e: ReactMouseEvent<HTMLButtonElement>, dragIndex: number) => {
    e.preventDefault(), (mouseMovement = -ELEMENT_HEIGHT + dragIndex * ELEMENT_HEIGHT);
    initialPosition = dragIndex;
    updateTransforms(dragIndex);

    const childNodes = wrapperRef.current?.childNodes as NodeListOf<HTMLLIElement> | undefined;
    draggingNode = childNodes?.[dragIndex];
    if (draggingNode) {
      draggingNode.style.width = `${draggingNode.getBoundingClientRect().width}px`;
      draggingNode.style.position = 'absolute';
      draggingNode.style.top = '0';
      draggingNode.style.zIndex = '9999';
      draggingNode.style.boxShadow = shadows.levitate1;
      draggingNode.style.transform = `translateY(${mouseMovement + ELEMENT_HEIGHT}px)`;
    }
    draggingIndex = dragIndex;
    childNodes?.forEach((node) => {
      node.style.transition = 'transform 100ms ease';
    });
    if (draggingNode) {
      draggingNode.style.transition = 'box-shadow 100ms ease';
    }
    window.addEventListener('mousemove', onDragging);
    window.addEventListener('mouseup', onDragEnd);
  };

  const onDragEnd = () => {
    window.removeEventListener('mousemove', onDragging);
    window.removeEventListener('mouseup', onDragEnd);
    const elementToMove = nodes[initialPosition];
    const toIndex = draggingIndex;
    const newNodes = [...nodes];
    newNodes.splice(initialPosition, 1);
    newNodes.splice(toIndex, 0, elementToMove);
    draggingIndex = -1;
    onUpdate(newNodes);
    deleteIndex = -1;
    const childNodes = wrapperRef.current?.childNodes as NodeListOf<HTMLLIElement> | undefined;
    childNodes?.forEach((node) => {
      node.style.transition = 'none';
      node.style.transform = 'none';
    });
    if (draggingNode) {
      draggingNode.style.width = 'auto';
      draggingNode.style.position = 'static';
      draggingNode.style.zIndex = '0';
      draggingNode.style.boxShadow = 'none';
    }
  };

  return (
    <NodeListWrapper ref={wrapperRef} draggingIndex={draggingIndex}>
      {nodes.map((node: Node, index) => (
        <NodeWrapper key={`${nodeSet}-${node.id}`}>
          {node.name}
          <ActionsContainer>
            <Tooltip tooltip={t('subjectpageForm.moveSubject')}>
              <DraggableIconButton
                aria-label={t('subjectpageForm.moveSubject')}
                colorTheme="light"
                onMouseDown={(e) => onDragStart(e, index)}
                variant="ghost"
              >
                <DragHorizontal />
              </DraggableIconButton>
            </Tooltip>
            <Tooltip tooltip={t('subjectpageForm.removeSubject')}>
              <IconButtonV2
                aria-label={t('subjectpageForm.removeSubject')}
                colorTheme="danger"
                onClick={() => onUpdate(nodes.filter((item) => item.id !== node.id))}
                variant="ghost"
              >
                <DeleteForever />
              </IconButtonV2>
            </Tooltip>
          </ActionsContainer>
        </NodeWrapper>
      ))}
    </NodeListWrapper>
  );
};

export default NodeList;
