/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AccordionValueChangeDetails } from "@ark-ui/react";
import { AccordionRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ReactElement, memo, useCallback, useState } from "react";
import { FormAccordionProps } from "./FormAccordion";

type ChildType = ReactElement<FormAccordionProps> | undefined | false;

interface Props {
  defaultOpen: string[];
  children: ChildType | ChildType[];
  articleId?: number;
  articleType?: string;
}

const AccordionsWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledAccordionRoot = styled(AccordionRoot, {
  base: {
    width: "100%",
  },
});

const FormAccordions = ({ defaultOpen, children }: Props) => {
  const [openAccordions, setOpenAccordions] = useState<string[]>(defaultOpen);

  const onValueChange = useCallback((details: AccordionValueChangeDetails) => {
    setOpenAccordions(details.value);
  }, []);

  return (
    <AccordionsWrapper>
      <StyledAccordionRoot multiple value={openAccordions} onValueChange={onValueChange} lazyMount unmountOnExit>
        {children}
      </StyledAccordionRoot>
    </AccordionsWrapper>
  );
};

export default memo(FormAccordions);
