/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { breakpoints, colors, mq, spacing } from '@ndla/core';
import { ExpandLess, ExpandMore } from '@ndla/icons/action';
import { ReactNode } from 'react';
import AccordionButtonLine from './AccordionButtonLine';

const StyledButton = styled(ButtonV2)`
  justify-content: flex-start;
  width: 100%;
  height: 100%;
`;

const StyledArrowButton = styled(StyledButton)`
  min-width: 50px;
  width: 50px;
`;

interface StyledAccordionTitleProps {
  type?: AccordionType;
}

const StyledAccordionTitle = styled.span<StyledAccordionTitleProps>`
  padding-left: ${spacing.normal};
  font-size: 1.25rem;
  color: ${p => (p.type === 'taxonomy' ? 'white' : 'rgb(102, 102, 102);')};
  align-items: center;
  display: flex;
  align-self: center;
  & > svg {
    margin-right: 10px;
    color: ${p => p.type === 'resourceGroup' && 'rgb(102, 102, 102)'};
  }
`;

interface StyledExpandProps {
  type?: AccordionType;
}

const StyledExpandMore = styled(ExpandMore)<StyledExpandProps>`
  width: 45px;
  height: 45px;
  color: ${p => (p.type === 'resourceGroup' ? 'rgb(136,136,136)' : 'white')};
  margin-right: ${p => p.type === 'resourceGroup' && '4px'};
`;
const StyledExpandLess = StyledExpandMore.withComponent(ExpandLess);

interface StyledContentProps {
  hidden?: boolean;
  type?: AccordionType;
}
const StyledContent = styled.div<StyledContentProps>`
  ${mq.range({ from: breakpoints.tablet })} {
    padding-left: ${spacing.small};
    padding-right: ${spacing.xsmall};
  }
  padding-bottom: ${p => !p.hidden && '3rem'};
  display: ${p => p.hidden && 'none'};
  margin-left: ${p => p.type === 'taxonomy' && spacing.normal};
  margin-bottom: ${p => p.type === 'resourceGroup' && '-1.8em'};
`;

export type AccordionType = 'resourceGroup' | 'taxonomy';

interface Props {
  inModal?: boolean;
  header: string | object;
  hidden: boolean;
  disabled?: boolean;
  handleToggle: () => void;
  className?: string;
  addButton?: ReactNode;
  appearance: AccordionType;
  toggleSwitch?: ReactNode;
  children?: ReactNode;
}

const Accordion = ({
  inModal,
  header,
  hidden,
  handleToggle,
  className,
  addButton,
  appearance,
  toggleSwitch,
  ...rest
}: Props) => {
  const title = <StyledAccordionTitle type={appearance}>{header}</StyledAccordionTitle>;
  const arrow = hidden ? (
    <StyledExpandMore type={appearance} />
  ) : (
    <StyledExpandLess type={appearance} />
  );

  return (
    <div {...rest}>
      {addButton ? (
        <AccordionButtonLine appearance={appearance}>
          <StyledButton variant="stripped" onClick={handleToggle}>
            {title}
          </StyledButton>
          <>{toggleSwitch}</>
          <>{addButton}</>
          <StyledArrowButton variant="stripped" onClick={handleToggle}>
            {arrow}
          </StyledArrowButton>
        </AccordionButtonLine>
      ) : (
        <AccordionButtonLine appearance={appearance}>
          {title}
          <>{toggleSwitch}</>
          {arrow}
        </AccordionButtonLine>
      )}
      <StyledContent hidden={hidden} type={appearance}>
        <>{rest.children}</>
      </StyledContent>
    </div>
  );
};

export default Accordion;
