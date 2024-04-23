/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement, memo, useState } from "react";
import styled from "@emotion/styled";
import { AccordionRoot } from "@ndla/accordion";
import { spacing } from "@ndla/core";
import { FormAccordionProps } from "./FormAccordion";
import OpenAllButton from "./OpenAllButton";
import { MainContent } from "../../containers/ArticlePage/styles";

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

const FormAccordions = ({ defaultOpen, children }: Props) => {
  const [openAccordions, setOpenAccordions] = useState<string[]>(defaultOpen);

  return (
    <AccordionsWrapper>
      <FlexWrapper>
        <OpenAllButton openAccordions={openAccordions} setOpenAccordions={setOpenAccordions} childs={children} />
      </FlexWrapper>
      <MainContent>
        <AccordionRoot type="multiple" value={openAccordions} onValueChange={setOpenAccordions}>
          {children}
        </AccordionRoot>
      </MainContent>
    </AccordionsWrapper>
  );
};

export default memo(FormAccordions);
