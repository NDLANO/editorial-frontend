/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { FC, ReactElement, useState } from 'react';
import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';
import { Editor, Node } from 'slate';
import DeleteButton from '../../../DeleteButton';

const StyledDetailsDiv = styled.div`
  position: relative;
  margin: ${spacing.large} 0;
  border: 1px solid ${colors.brand.greyLight};
  overflow: hidden;
  > *:last-child {
    margin-bottom: 0;
  }
`;

const StyledContent = styled.div<{ isOpen: boolean }>`
  display: ${p => (p.isOpen ? '' : 'none')};
  margin-top: calc(${spacing.small} * 1.5);
  padding-left: ${spacing.normal};
`;

const StyledSummary = styled.summary<{ isOpen: boolean }>`
  color: ${colors.brand.primary};
  cursor: pointer;
  font-size: 20px;
  padding: ${spacing.normal};
  display: flex;

  &::before {
    content: '';
    margin-left: ${spacing.normal};
    border-color: transparent ${colors.brand.primary};
    border-style: solid;
    border-width: 0.35em 0 0.35em 0.45em;
    display: block;
    height: 0;
    width: 0;
    left: -1em;
    top: 0.4em;
    position: relative;
    transform: ${p => p.isOpen && 'rotate(90deg)'};
  }
`;

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &:focus button,
  :hover button {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

interface Props {
  children: ReactElement[];
  editor: Editor;
  editSummaryButton: ReactElement;
  node: Node;
}

const Details: FC<Props> = ({ children, editor, editSummaryButton, node }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  const onRemoveClick = () => {
    editor.removeNodeByKey(node.key);
    editor.focus();
  };

  const [summaryNode, ...contentNodes] = children;

  return (
    <StyledDetailsDiv>
      <StyledRow>
        <StyledSummary isOpen={isOpen} onClick={toggleOpen}>
          {summaryNode}
        </StyledSummary>
        {isOpen && editSummaryButton}
      </StyledRow>
      <StyledContent isOpen={isOpen}>{contentNodes}</StyledContent>
      <DeleteButton data-cy="remove-details" stripped onMouseDown={onRemoveClick} />
    </StyledDetailsDiv>
  );
};

export default Details;
