/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, MouseEventHandler, ReactNode, useCallback, useState } from 'react';
import { RenderElementProps } from 'slate-react';
import { useTranslation } from 'react-i18next';
import { IconButtonV2 } from '@ndla/button';
import { ChevronDown, ChevronUp } from '@ndla/icons/common';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import DeleteButton from '../../../DeleteButton';
import MoveContentButton from '../../../MoveContentButton';

const StyledButton = styled(IconButtonV2)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 2px;
  margin: auto;
  padding: 5px 15px !important;
  width: 0;
  height: 33px;
  border-radius: 50% !important;
  svg {
    min-width: 24px;
    width: 24px;
    height: 24px;
  }
`;

interface ExpandProps {
  expanded?: boolean;
}

const StyledDiv = styled.div<ExpandProps>`
  border: 1px solid ${colors.brand.greyLight};
  padding: ${spacing.small};
  overflow: ${(props) => (props.expanded ? 'visible' : 'hidden')};
`;

const StyledAside = styled.aside<ExpandProps>`
  overflow: ${(props) => (props.expanded ? 'visible' : 'hidden')};
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;

interface Props {
  children: ReactNode;
  onRemoveClick?: MouseEventHandler;
  onMoveContent?: MouseEventHandler;
  attributes: RenderElementProps['attributes'];
}

const SlateFactAside = ({ children, onRemoveClick, attributes, onMoveContent }: Props) => {
  const [expanded, setExpanded] = useState(true);
  const { t } = useTranslation();

  const toggleExpanded = useCallback((evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    setExpanded((p) => !p);
  }, []);

  return (
    <StyledAside
      expanded={expanded}
      className={expanded ? 'c-factbox expanded' : 'c-factbox'}
      draggable
      {...attributes}
    >
      <StyledDiv expanded={expanded} className="c-factbox__content">
        <ButtonContainer>
          <MoveContentButton onMouseDown={onMoveContent} />
          <DeleteButton
            aria-label={t('form.remove')}
            variant="stripped"
            onMouseDown={onRemoveClick}
            data-testid="remove-fact-aside"
          />
        </ButtonContainer>
        {children}
      </StyledDiv>
      <StyledButton
        aria-label={t(`factbox.${expanded ? 'close' : 'open'}`)}
        contentEditable={false}
        onMouseDown={toggleExpanded}
      >
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </StyledButton>
    </StyledAside>
  );
};

export default SlateFactAside;
