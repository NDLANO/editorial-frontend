/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, memo } from "react";
import { ArrowDownShortLine } from "@ndla/icons";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemTrigger,
  Heading,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

export interface FormAccordionProps {
  children: ReactNode;
  title: ReactNode;
  hasError: boolean;
  id: string;
}

const StyledAccordionItemTrigger = styled(AccordionItemTrigger, {
  variants: {
    invalid: {
      true: {
        background: "surface.dangerSubtle",
        boxShadowColor: "stroke.error",
        _hover: {
          background: "surface.dangerSubtle.hover",
          boxShadowColor: "stroke.error",
        },
        _active: {
          background: "surface.dangerSubtle.active",
          boxShadowColor: "stroke.error",
        },
        _open: {
          background: "surface.dangerSubtle",
          boxShadowColor: "stroke.error",
        },
      },
    },
  },
});

const StyledAccordionItemContent = styled(AccordionItemContent, {
  base: {
    overflowX: "visible",
    // We need to keep overflow unset for our sticky toolbar.
    // Ark has a bug where data-state is removed when the accordion is open, so we have to check
    // whether it doesn't exist to know if the accordion is open.
    "&:not([data-state])": {
      overflow: "unset",
    },
  },
  variants: {
    invalid: {
      true: {
        borderColor: "stroke.error",
      },
    },
  },
});

const FormAccordion = ({ children, title, hasError, id }: FormAccordionProps) => {
  return (
    <AccordionItem value={id}>
      <Heading asChild consumeCss textStyle="label.medium" fontWeight="bold">
        <h2>
          <StyledAccordionItemTrigger invalid={hasError}>
            {title}
            <AccordionItemIndicator asChild>
              <ArrowDownShortLine size="medium" />
            </AccordionItemIndicator>
          </StyledAccordionItemTrigger>
        </h2>
      </Heading>
      <StyledAccordionItemContent invalid={hasError}>{children}</StyledAccordionItemContent>
    </AccordionItem>
  );
};

export default memo(FormAccordion);
