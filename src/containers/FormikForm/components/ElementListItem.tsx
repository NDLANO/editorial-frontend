/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { spacing, spacingUnit, colors, fonts, animations } from '@ndla/core';
import { DragHorizontal, DeleteForever } from '@ndla/icons/editor';
import { ElementType } from './ElementList';
import { resourceToLinkProps } from '../../../util/resourceHelpers';

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
  articleType?: string;
  deleteIndex: number;
  isEditable: boolean;
  isOrderable: boolean;
  element: ElementType;
  executeDeleteFile: () => void;
  index: number;
  locale: string;
  messages?: MessageProps;
  onDragEnd: () => void;
  onDragStart: (evt: MouseEvent<HTMLButtonElement>, dragIndex: number) => void;
  showDragTooltip: boolean;
}

const DraggableIconButton = styled(IconButtonV2)`
  cursor: grabbing;
`;

const ElementListItem = ({
  deleteFile,
  articleType,
  deleteIndex,
  isEditable,
  isOrderable,
  element,
  executeDeleteFile,
  index,
  locale,
  messages,
  onDragEnd,
  onDragStart,
  showDragTooltip,
}: Props) => {
  const linkProps = resourceToLinkProps(
    element,
    element.articleType ?? articleType ?? 'learning-path',
    locale,
  );

  return (
    <StyledListItem
      data-testid="elementListItem"
      delete={deleteIndex === index}
      onAnimationEnd={deleteIndex === index ? executeDeleteFile : undefined}
    >
      <div>
        <StyledElementImage
          src={
            (element.metaImage?.url && `${element.metaImage.url}?width=100`) || '/placeholder.png'
          }
          alt={element.metaImage?.alt || ''}
        />
        {linkProps.to ? (
          <Link to={linkProps.to} target="_blank" rel="noopener noreferrer">
            {element.title?.title}
          </Link>
        ) : (
          <a href={linkProps.href} target={linkProps.target} rel={linkProps.rel}>
            {element.title?.title}
          </a>
        )}
      </div>
      {isEditable && (
        <div>
          {isOrderable ? (
            showDragTooltip ? (
              <DraggableIconButton
                aria-label={messages?.dragElement || ''}
                variant="ghost"
                colorTheme="light"
                onMouseDown={(e) => onDragStart(e, index)}
                onMouseUp={onDragEnd}
                title={messages?.dragElement || ''}
              >
                <DragHorizontal />
              </DraggableIconButton>
            ) : (
              <DraggableIconButton
                aria-label={messages?.dragElement || ''}
                variant="ghost"
                colorTheme="light"
                onMouseDown={(e) => onDragStart(e, index)}
                onMouseUp={onDragEnd}
              >
                <DragHorizontal />
              </DraggableIconButton>
            )
          ) : null}
          <IconButtonV2
            aria-label={messages?.removeElement || ''}
            variant="ghost"
            colorTheme="danger"
            data-testid="elementListItemDeleteButton"
            onClick={() => deleteFile(index)}
            title={messages?.removeElement || ''}
          >
            <DeleteForever />
          </IconButtonV2>
        </div>
      )}
    </StyledListItem>
  );
};

export const StyledListItem = styled.li<StyledProps>`
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
  ${(props) =>
    props.delete &&
    css`
      ${animations.fadeOut()}
    `}
`;

const StyledElementImage = styled.img`
  width: ${ELEMENT_HEIGHT * 1.33}px;
  height: ${ELEMENT_HEIGHT - spacingUnit / 2}px;
  object-fit: cover;
  margin-right: ${spacing.small};
`;

export default ElementListItem;
