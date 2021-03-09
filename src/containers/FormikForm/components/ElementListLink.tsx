/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { spacing, colors, fonts, animations } from '@ndla/core';
import { Link } from '@ndla/icons/common';
import Tooltip from '@ndla/tooltip';
import { DragHorizontal, DeleteForever } from '@ndla/icons/editor';
import { RelatedContentLink } from '../../../interfaces';

const ELEMENT_HEIGHT = 69;
const ELEMENT_MARGIN = 4;

interface StyledProps {
  delete?: boolean;
  draggable?: boolean;
}

interface MessageProps {
  removeElement: string;
  dragElement: string;
}

interface Props {
  deleteFile: (deleteIndex: number) => void;
  deleteIndex: number;
  // Element can be of type Article or Learningpath
  element: RelatedContentLink;
  executeDeleteFile: () => void;
  index: number;
  locale: string;
  messages: MessageProps;
  onDragEnd: () => void;
  onDragStart: (evt: React.MouseEvent, dragIndex: number) => void;
  showDragTooltip: boolean;
}

const ElementListLink = ({
  deleteFile,
  deleteIndex,
  element,
  executeDeleteFile,
  index,
  messages: { removeElement, dragElement },
  onDragEnd,
  onDragStart,
  showDragTooltip,
}: Props) => {
  return (
    <StyledListItem
      delete={deleteIndex === index}
      onAnimationEnd={deleteIndex === index ? executeDeleteFile : undefined}>
      <div>
        <StyledLinkContainer>
          <Link />
        </StyledLinkContainer>

        <Tooltip tooltip={element.url}>
          <a href={element.url} target="_blank" rel="noopener noreferrer">
            {element.title}
          </a>
        </Tooltip>
      </div>
      <div>
        {showDragTooltip ? (
          <Tooltip tooltip={dragElement}>
            <StyledButtonIcons
              draggable
              tabIndex={-1}
              type="button"
              onMouseDown={e => onDragStart(e, index)}
              onMouseUp={onDragEnd}>
              <DragHorizontal />
            </StyledButtonIcons>
          </Tooltip>
        ) : (
          <StyledButtonIcons
            draggable
            tabIndex={-1}
            type="button"
            onMouseDown={e => onDragStart(e, index)}
            onMouseUp={onDragEnd}>
            <DragHorizontal />
          </StyledButtonIcons>
        )}
        <Tooltip tooltip={removeElement}>
          <StyledButtonIcons tabIndex={-1} type="button" onClick={() => deleteFile(index)} delete>
            <DeleteForever />
          </StyledButtonIcons>
        </Tooltip>
      </div>
    </StyledListItem>
  );
};

const StyledLinkContainer = styled.div`
  background: ${colors.background.darker};
  width: ${ELEMENT_HEIGHT * 1.33}px;
  height: ${ELEMENT_HEIGHT - spacing.spacingUnit / 2}px;
  object-fit: cover;
  margin-right: ${spacing.small};
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    height: 30px;
    width: 30px;
    color: ${colors.brand.greyMedium};
  }
`;

const StyledListItem = styled.li<StyledProps>`
  margin: ${ELEMENT_MARGIN}px 0 0;
  padding: 0;
  background: ${colors.brand.greyLighter};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${ELEMENT_HEIGHT - ELEMENT_MARGIN}px;
  max-width: 100%;
  box-sizing: border-box;
  ${fonts.sizes(18, 1.1)};
  font-weight: ${fonts.weight.semibold};
  font-family: ${fonts.sans};
  > div {
    display: flex;
    align-items: center;
    padding: 0 ${spacing.small} 0 calc(${spacing.small} + ${spacing.xsmall});
    &:first-of-type {
      flex-grow: 1;
      padding-left: ${spacing.xsmall};
    }
  }
  ${props =>
    props.delete &&
    css`
      ${animations.fadeOut()}
    `}
`;

const StyledButtonIcons = styled.button<StyledProps>`
  border: 0;
  background: none;
  color: ${colors.brand.primary};
  width: ${spacing.medium};
  height: ${spacing.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border-radius: 100%;
  transition: background 200ms ease;
  svg {
    width: 18px;
    height: 18px;
  }
  &:hover,
  &:focus {
    background: ${colors.brand.light};
  }
  ${props =>
    props.delete &&
    css`
      color: ${colors.support.red};
      &:hover,
      &:focus {
        background: ${colors.support.redLight};
      }
    `}
  ${props =>
    props.draggable &&
    css`
      cursor: grabbing;
    `};
`;

export default ElementListLink;
