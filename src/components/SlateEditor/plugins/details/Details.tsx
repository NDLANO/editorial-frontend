/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import { Editor, Transforms, Element } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';
import DeleteButton from '../../../DeleteButton';
import MoveContentButton from '../../../MoveContentButton';
import { TYPE_DETAILS } from '.';

const StyledDetailsDiv = styled.div`
  margin: ${spacing.large} 0;
  border: 1px solid ${colors.brand.greyLight};
  overflow: visible;
  > *:last-child {
    margin-bottom: 0;
  }
  position: relative;
`;

const StyledContent = styled.div<{ isOpen: boolean }>`
  display: ${p => (p.isOpen ? '' : 'none')};
  margin-top: calc(${spacing.small} * 1.5);
  padding-left: ${spacing.normal};
`;

const StyledChevron = styled.div<{ isOpen: boolean }>`
  color: ${colors.brand.primary};
  font-size: 20px;
  cursor: pointer;
  display: flex;
  user-select: none;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  &::before {
    user-select: none;
    content: '';
    margin-left: ${spacing.normal};
    border-color: transparent ${colors.brand.primary};
    border-style: solid;
    border-width: 0.35em 0 0.35em 0.45em;
    display: block;
    transform: ${p => p.isOpen && 'rotate(90deg)'};
  }
`;

const StyledSummary = styled.summary`
  flex-grow: 1;
  color: ${colors.brand.primary};
  font-size: 20px;
  cursor: inherit;
  padding: ${spacing.normal} ${spacing.small};
  display: block;
`;

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  &:focus button,
  :hover button {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

interface Props {
  editor: Editor;
}

const Details = ({ children, editor, element, attributes }: Props & RenderElementProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const onRemoveClick = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, {
      at: path,
      match: node => Element.isElement(node) && node.type === TYPE_DETAILS,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor);
    }, 0);
  };

  const onMoveContent = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, {
      at: path,
      match: node => Element.isElement(node) && node.type === TYPE_DETAILS,
      voids: true,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor, { edge: 'start' });
    }, 0);
  };

  const [summaryNode, ...contentNodes] = children;

  return (
    <StyledDetailsDiv className="c-bodybox" {...attributes} draggable>
      <StyledRow>
        <div contentEditable={false}>
          <StyledChevron isOpen={isOpen} onClick={toggleOpen} />
        </div>
        <StyledSummary>{summaryNode}</StyledSummary>
      </StyledRow>
      <StyledContent isOpen={isOpen}>{contentNodes}</StyledContent>
      <MoveContentButton onMouseDown={onMoveContent} />
      <DeleteButton tabIndex="-1" data-cy="remove-details" stripped onMouseDown={onRemoveClick} />
    </StyledDetailsDiv>
  );
};

export default Details;
