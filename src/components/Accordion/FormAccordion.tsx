/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, memo } from "react";
import styled from "@emotion/styled";
import { AccordionContent, AccordionHeader, AccordionItem } from "@ndla/accordion";
import { colors, misc, spacing } from "@ndla/core";

type Variant = "center";

export interface FormAccordionProps {
  children: ReactNode;
  title: ReactNode;
  hasError: boolean;
  className?: string;
  id: string;
  wide?: boolean;
  isFrontpageArticle?: boolean;
  variant?: Variant;
}

const StyledHeader = styled(AccordionHeader)`
  &[data-error="true"] {
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

  &:hover {
    text-decoration: none;

    // Underline normal string headers
    > div:not(:has(*)) {
      text-decoration: underline;
    }

    // Use data-underline to determine which parts of header should be underlined
    > div > [data-underline=""] {
      text-decoration: underline;
    }
  }
`;

const StyledItem = styled(AccordionItem)`
  border-radius: ${misc.borderRadius};
  background-color: ${colors.white};
  overflow: hidden;

  &:focus-visible {
    border: 2px solid ${colors.support.red};
  }

  & > div {
    overflow: unset;
  }

  &[data-error="true"] {
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
  width: 100%;
  &[data-frontpage="true"] {
    background-color: ${colors.background.lightBlue};
    inset: unset !important;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  &[data-variant="center"] {
    position: relative;
    width: 83.333%;
    right: auto;
    left: 8.333%;
  }
`;

const FormAccordion = ({
  children,
  title,
  hasError,
  id,
  className,
  wide,
  isFrontpageArticle,
  variant,
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
        data-variant={variant}
      >
        {children}
      </StyledAccordionContent>
    </StyledItem>
  );
};

export default memo(FormAccordion);
