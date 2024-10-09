/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement, memo, useState } from "react";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { AccordionRoot } from "@ndla/primitives";
import { FormAccordionProps } from "./FormAccordion";
import OpenAllButton from "./OpenAllButton";

type ChildType = ReactElement<FormAccordionProps> | undefined | false;

interface Props {
  defaultOpen: string[];
  children: ChildType | ChildType[];
  articleId?: number;
  articleType?: string;
}

const AccordionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const StyledAccordionRoot = styled(AccordionRoot)`
  width: 100%;
`;

const FormAccordions = ({ defaultOpen, children }: Props) => {
  const [openAccordions, setOpenAccordions] = useState<string[]>(defaultOpen);

  return (
    <AccordionsWrapper>
      <FlexWrapper>
        <OpenAllButton
          openAccordions={openAccordions}
          setOpenAccordions={setOpenAccordions}
          formAccordionChildren={children}
        />
      </FlexWrapper>
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
