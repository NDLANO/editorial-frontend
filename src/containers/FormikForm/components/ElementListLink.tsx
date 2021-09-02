/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import styled from '@emotion/styled';
import { spacing, spacingUnit, colors } from '@ndla/core';
import { Link } from '@ndla/icons/common';
import Tooltip from '@ndla/tooltip';
import { DragHorizontal, DeleteForever } from '@ndla/icons/editor';
import { RelatedContentLink } from '../../../interfaces';
import { StyledButtonIcons, StyledListItem } from './ElementListItem';

const ELEMENT_HEIGHT = 69;

interface MessageProps {
  removeElement: string;
  dragElement: string;
}

interface Props {
  deleteFile: (deleteIndex: number) => void;
  deleteIndex: number;
  isEditable: boolean;
  isOrderable: boolean;
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
  isEditable,
  isOrderable,
  element,
  executeDeleteFile,
  index,
  messages,
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
      {isEditable && (
        <div>
          {isOrderable ? (
            showDragTooltip ? (
              <Tooltip tooltip={messages?.dragElement}>
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
            )
          ) : null}
          <Tooltip tooltip={messages?.removeElement}>
            <StyledButtonIcons tabIndex={-1} type="button" onClick={() => deleteFile(index)} delete>
              <DeleteForever />
            </StyledButtonIcons>
          </Tooltip>
        </div>
      )}
    </StyledListItem>
  );
};

const StyledLinkContainer = styled.div`
  background: ${colors.background.darker};
  width: ${ELEMENT_HEIGHT * 1.33}px;
  height: ${ELEMENT_HEIGHT - spacingUnit / 2}px;
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

export default ElementListLink;
