/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDownShortLine } from "@ndla/icons";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemTrigger,
  AccordionRoot,
  Heading,
  OrderedList,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { LearningPathV2DTO, LearningStepV2DTO } from "@ndla/types-backend/learningpath-api";
import { contains } from "@ndla/util";
import { toPreviewLearningpath } from "../../util/routeHelpers";

interface Props {
  learningpath: LearningPathV2DTO;
  language: string;
  step: LearningStepV2DTO;
}

const StyledAccordionRoot = styled(AccordionRoot, {
  base: {
    display: "block",
    gridArea: "steps",
    position: "sticky",
    zIndex: "sticky",
    marginInline: "-xsmall",
    top: "var(--masthead-height)",
  },
});

const StyledAccordionItem = styled(AccordionItem, {
  base: {
    borderRadius: "xsmall",
    boxShadow: "small",
  },
});

const StyledAccordionItemContent = styled(AccordionItemContent, {
  base: {
    background: "background.default",
  },
});

export const LearningpathMenu = ({ learningpath, language, step }: Props) => {
  const id = useId();
  const { t } = useTranslation();
  const accordionRef = useRef<HTMLDivElement>(null);
  const [accordionValue, setAccordionValue] = useState<string[]>();
  return (
    <StyledAccordionRoot
      ref={accordionRef}
      id={step.id.toString()}
      value={accordionValue}
      onValueChange={(details) => setAccordionValue(details.value)}
      variant="bordered"
      multiple
      onBlur={(e) => {
        // automatically close the accordion when focus leaves the accordion on mobile.
        if (!contains(accordionRef.current, e.relatedTarget ?? e.target)) {
          setAccordionValue([]);
        }
      }}
    >
      <StyledAccordionItem value="menu">
        <Heading asChild consumeCss textStyle="label.medium" fontWeight="bold">
          <span>
            <AccordionItemTrigger>
              {t("learningpathForm.preview.learningpathMenu")}
              <AccordionItemIndicator asChild>
                <ArrowDownShortLine />
              </AccordionItemIndicator>
            </AccordionItemTrigger>
          </span>
        </Heading>
        <StyledAccordionItemContent>
          <nav aria-labelledby={id}>
            <Heading id={id} textStyle="title.medium" asChild consumeCss>
              <h2>{t("learningpathForm.preview.learningpathMenuTitle")}</h2>
            </Heading>
            <OrderedList>
              {learningpath.learningsteps.map((step) => (
                <li key={step.id}>
                  <SafeLink
                    onClick={() => setAccordionValue([])}
                    to={toPreviewLearningpath(learningpath.id, language, step.id)}
                  >
                    {step.title.title}
                  </SafeLink>
                </li>
              ))}
            </OrderedList>
          </nav>
        </StyledAccordionItemContent>
      </StyledAccordionItem>
    </StyledAccordionRoot>
  );
};
