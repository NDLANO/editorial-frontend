/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEventHandler, ReactNode, useCallback, useState } from 'react';
import { RenderElementProps } from 'slate-react';
import Button from '@ndla/button';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import DeleteButton from '../../../DeleteButton';
import MoveContentButton from '../../../MoveContentButton';

const StyledButton = styled(Button)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 2px;
  z-index: 9;
  box-shadow: 0 0 15px hsla(0, 0%, 50%, 0.3);
  margin: auto;
  padding: 5px 15px !important;
  width: 0;
  height: 33px;
  text-align: center;
  font-size: 14px;
  border-radius: 50% !important;

  &:after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 45%;
    left: 32%;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid ${colors.white};
  }

  &:hover,
  &:active {
    background: ${colors.brand.dark} !important;
  }
`;

interface ExpandProps {
  expanded?: boolean;
}

const StyledDiv = styled.div<ExpandProps>`
  overflow: ${props => (props.expanded ? 'visible' : 'hidden')};
`;

const StyledAside = styled.aside<ExpandProps>`
  overflow: ${props => (props.expanded ? 'visible' : 'hidden')};
`;

interface Props {
  children: ReactNode;
  onRemoveClick?: MouseEventHandler;
  onMoveContent?: MouseEventHandler;
  attributes: RenderElementProps['attributes'];
}

const SlateFactAside = ({ children, onRemoveClick, attributes, onMoveContent }: Props) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = useCallback(evt => {
    evt.preventDefault();
    setExpanded(p => !p);
  }, []);

  return (
    <StyledAside
      expanded={expanded}
      className={expanded ? 'c-factbox expanded' : 'c-factbox'}
      draggable
      {...attributes}>
      <StyledDiv expanded={expanded} className="c-factbox__content c-bodybox">
        <MoveContentButton onMouseDown={onMoveContent} />
        <DeleteButton
          stripped
          onMouseDown={onRemoveClick}
          data-cy="remove-fact-aside"
          tabIndex="-1"
        />
        {children}
      </StyledDiv>
      <StyledButton
        contentEditable={false}
        onMouseDown={toggleExpanded}
        className="c-factbox__button"
      />
    </StyledAside>
  );
};

export default SlateFactAside;
