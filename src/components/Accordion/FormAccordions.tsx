/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement, memo, useState } from "react";
import { AccordionRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
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

  return (
    <AccordionsWrapper>
      <StyledAccordionRoot
        multiple
        value={openAccordions}
        onValueChange={(details) => setOpenAccordions(details.value)}
        lazyMount
        unmountOnExit
      >
        {children}
      </StyledAccordionRoot>
    </AccordionsWrapper>
  );
};

export default memo(FormAccordions);
