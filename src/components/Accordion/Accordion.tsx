/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { colors, mq, spacing } from '@ndla/core';
import Button from '@ndla/button';
import { ExpandLess, ExpandMore } from '@ndla/icons/action';
import AccordionButtonLine from './AccordionButtonLine';

const buttonStyle = css`
  color: ${colors.brand.greyDark};
  width: 100%;
  height: 100%;
  text-align: left;
`;

const arrowButtonStyle = css`
  ${buttonStyle} min-width: 50px;
  width: 50px;
`;

interface StyledAccordionTitleProps {
  type?: AccordionType;
}

const StyledAccordionTitle = styled.span<StyledAccordionTitleProps>`
  padding-left: 1.3rem;
  font-size: 1.25rem;
  color: ${p => (p.type === 'taxonomy' ? 'white' : 'rgb(102, 102, 102);')};
  align-items: center;
  display: flex;
  align-self: center;
  margin-right: 0.2em;
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
  ${mq.range({ from: '37.5em' })} {
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
  appearance: 'resourceGroup' | 'taxonomy';
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
        <AccordionButtonLine
          addButton={addButton}
          appearance={appearance}
          handleToggle={handleToggle}>
          <Button css={buttonStyle} stripped onClick={handleToggle}>
            {title}
          </Button>
          <>{toggleSwitch}</>
          <>{addButton}</>
          <Button css={arrowButtonStyle} stripped onClick={handleToggle}>
            {arrow}
          </Button>
        </AccordionButtonLine>
      ) : (
        <AccordionButtonLine appearance={appearance} handleToggle={handleToggle}>
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
