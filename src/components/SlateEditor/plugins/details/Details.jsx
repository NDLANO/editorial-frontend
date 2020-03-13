/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Types from 'slate-prop-types';
import { injectT } from '@ndla/i18n';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';
import { EditorShape } from '../../../../shapes';
import DeleteButton from '../../../DeleteButton';

const solutionboxStyle = css`
  background-color: ${colors.tableBg};
  border: none;
  width: 100%;
`;

const StyledDetailsDiv = styled.div`
  position: relative;
  margin: ${spacing.large} 0;
  border: 1px solid ${colors.brand.greyLight};
  overflow: hidden;
  ${p => p.isSolutionbox && solutionboxStyle}
  > *:last-child {
    margin-bottom: 0;
  }
`;

const StyledContent = styled.div`
  display: ${p => (p.isOpen ? '' : 'none')};
  margin-top: calc(${spacing.small} * 1.5);
  padding-left: ${spacing.normal};
`;

const solutionboxSummaryStyle = css`
  background-color: ${colors.brand.lightest};
  width: 100%;
`;

const StyledSummary = styled.summary`
  color: ${colors.brand.primary};
  cursor: pointer;
  font-size: 20px;
  padding: ${spacing.normal};
  display: flex;

  ${p => p.isSolutionbox && solutionboxSummaryStyle}

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

const Details = props => {
  const { node, isSolutionbox, children, editor, editSummaryButton } = props;

  const onRemoveClick = () => {
    editor.removeNodeByKey(node.key);
  };

  const [isOpen, setIsOpen] = useState(true);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  const [summaryNode, ...contentNodes] = children;

  return (
    <StyledDetailsDiv isSolutionbox={isSolutionbox}>
      <StyledRow>
        <StyledSummary
          isSolutionbox={isSolutionbox}
          isOpen={isOpen}
          onClick={toggleOpen}>
          {summaryNode}
        </StyledSummary>
        {isOpen && editSummaryButton}
      </StyledRow>
      <StyledContent isOpen={isOpen}>{contentNodes}</StyledContent>
      <DeleteButton
        data-cy="remove-details"
        stripped
        onMouseDown={onRemoveClick}
      />
    </StyledDetailsDiv>
  );
};

Details.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  node: Types.node.isRequired,
  editor: EditorShape,
  editSummaryButton: PropTypes.node,
  isSolutionbox: PropTypes.bool,
};

export default injectT(Details);
