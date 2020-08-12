/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { spacing, colors, fonts, animations } from '@ndla/core';
import Tooltip from '@ndla/tooltip';
import { DragHorizontal, DeleteForever } from '@ndla/icons/editor';
import { ContentResultShape } from '../../../shapes';
import { toEditArticle } from '../../../util/routeHelpers';

const ELEMENT_HEIGHT = 69;
const ELEMENT_MARGIN = 4;

const ElementListItem = ({
  element,
  deleteIndex,
  messages: { removeElement, dragElement },
  index,
  showDragTooptil,
  executeDeleteFile,
  onDragEnd,
  onDragStart,
  deleteFile,
}) => (
  <StyledListItem
    key={element.id}
    delete={deleteIndex === index}
    onAnimationEnd={deleteIndex === index ? executeDeleteFile : undefined}>
    <div>
      <StyledElementImage
        src={element.metaImage ? element.metaImage.url : ''}
        alt={element.metaImage ? element.metaImage.alt : ''}
      />
      <Link to={toEditArticle(element.id, element.learningReasourceType)}>
        {element.title.title}
      </Link>
    </div>
    <div>
      {showDragTooptil ? (
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
        <StyledButtonIcons
          tabIndex={-1}
          type="button"
          onClick={() => deleteFile(index)}
          delete>
          <DeleteForever />
        </StyledButtonIcons>
      </Tooltip>
    </div>
  </StyledListItem>
);

const StyledListItem = styled.li`
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
    svg {
      width: 18px;
      height: 18px;
    }
  }
  ${props =>
    props.delete &&
    css`
      ${animations.fadeOut()}
    `}
`;

const StyledElementImage = styled.img`
  width: ${ELEMENT_HEIGHT * 1.33}px;
  height: ${ELEMENT_HEIGHT - spacing.spacingUnit / 2}px;
  object-fit: cover;
  margin-right: ${spacing.small};
`;

const StyledButtonIcons = styled.button`
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

ElementListItem.propTypes = {
  element: ContentResultShape.isRequired,
  deleteIndex: PropTypes.number,
  removeElement: PropTypes.string,
  dragElement: PropTypes.string,
  index: PropTypes.number,
  showDragTooptil: PropTypes.bool,
  executeDeleteFile: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  deleteFile: PropTypes.func.isRequired,
  messages: PropTypes.shape({
    removeElement: PropTypes.string.isRequired,
    dragElement: PropTypes.string.isRequired,
  }).isRequired,
};

export default ElementListItem;
