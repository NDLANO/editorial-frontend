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

const detailsStyle = css`
  position: relative;
  margin: ${spacing.large} 0;
  padding-left: ${spacing.normal};
  min-height: 90px;
  border: 1px solid ${colors.brand.greyLight};
  overflow: hidden;

  > *:last-child {
    margin-bottom: 0;
  }
`;

const StyledContent = styled.div`
  display: ${p => (p.open ? '' : 'none')};
  margin-top: calc(${spacing.small} * 1.5);
`;

const StyledSummary = styled.summary`
  color: ${colors.brand.primary};
  cursor: pointer;
  font-size: 20px;
  padding: ${spacing.normal};
  display: flex;

  &::before {
    content: '';
    border-color: transparent ${colors.brand.primary};
    border-style: solid;
    border-width: 0.35em 0 0.35em 0.45em;
    display: block;
    height: 0;
    width: 0;
    left: -1em;
    top: 0.4em;
    position: relative;
    transform: ${p => p.open && 'rotate(90deg)'};
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
  const { node, attributes, children, editor, editSummaryButton, t } = props;

  const onRemoveClick = () => {
    editor.removeNodeByKey(node.key);
  };

  const [isOpen, setIsOpen] = useState(true);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div css={detailsStyle} draggable {...attributes}>
      <StyledRow>
        <StyledSummary open={isOpen} onClick={toggleOpen}>
          Fasitboks
        </StyledSummary>
        {isOpen && editSummaryButton}
      </StyledRow>
      <StyledContent open={isOpen}>{children}</StyledContent>
      <DeleteButton stripped onMouseDown={onRemoveClick} />
    </div>
  );
};

Details.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  node: Types.node.isRequired,
  editor: EditorShape,
  editSummaryButton: PropTypes.node,
};

export default injectT(Details);
