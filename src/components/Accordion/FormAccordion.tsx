/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, memo } from 'react';
import styled from '@emotion/styled';
import { AccordionContent, AccordionHeader, AccordionItem } from '@ndla/accordion';
import { colors, misc, spacing } from '@ndla/core';

export interface FormAccordionProps {
  children: ReactNode;
  title: string;
  hasError: boolean;
  className?: string;
  id: string;
  wide?: boolean;
  isFrontpageArticle?: boolean;
}

const StyledHeader = styled(AccordionHeader)`
  &[data-error='true'] {
    background-color: ${colors.support.redLight};
    border-color: ${colors.support.red};
    color: ${colors.text.primary};
    svg {
      color: ${colors.text.primary};
    }
  }
  &:focus-visible {
    outline: 2px solid ${colors.support.red};
  }
`;

const StyledItem = styled(AccordionItem)`
  overflow: hidden;
  border-radius: ${misc.borderRadius};
  background-color: ${colors.white};

  &:focus-visible {
    border: 2px solid ${colors.support.red};
  }

  &[data-error='true'] {
    border-color: ${colors.support.red};
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
  svg {
    color: ${colors.white};
    width: 20px;
    height: 20px;
  }
`;

const StyledAccordionContent = styled(AccordionContent)`
  &[data-frontpage='true'] {
    background-color: ${colors.background.lightBlue};
    width: 100% !important;
    inset: unset !important;

    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const FormAccordion = ({
  children,
  title,
  hasError,
  id,
  className = 'u-6/6',
  wide,
  isFrontpageArticle,
}: FormAccordionProps) => {
  return (
    <StyledItem value={id} data-error={hasError}>
      <StyledHeader data-error={hasError}>
        <HeaderWrapper data-error={hasError}>{title}</HeaderWrapper>
      </StyledHeader>
      <StyledAccordionContent
        id={id}
        className={className}
        data-wide={!!wide}
        data-frontpage={!!isFrontpageArticle}
      >
        {children}
      </StyledAccordionContent>
    </StyledItem>
  );
};

export default memo(FormAccordion);
