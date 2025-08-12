/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { Stack, styled } from "@ndla/styled-system/jsx";
import { toEditLearningpath } from "../../../util/routeHelpers";

const STEPS = ["metadata", "steps", "preview", "status"] as const;
type States = (typeof STEPS)[number];

interface Props {
  currentStep: States;
  id: number;
  language: string;
}

const StepWrapper = styled("ol", {
  base: {
    display: "flex",
    listStyle: "none",
    gap: "4xsmall",
    tabletWideDown: {
      display: "none",
    },
  },
});

const Step = styled("li", {
  base: {
    display: "flex",
    gap: "4xsmall",
    alignItems: "center",
    _last: {
      "& div": {
        display: "none",
      },
    },
  },
});

const NumberText = styled(Text, {
  base: {
    borderRadius: "50%",
    borderColor: "stroke.default",
    border: "1px solid",
    paddingInline: "3xsmall",
    width: "2.5ch",
    textAlign: "center",
    _selected: {
      backgroundColor: "surface.brand.1",
    },
  },
});

const Line = styled("div", {
  base: {
    display: "block",
    borderStyle: "inset",
    borderBlockEnd: "1px solid",
    width: "xsmall",
    borderColor: "icon.strong",
    justifyContent: "center",
    alignItems: "center",
  },
});

const StyledSafeLink = styled(SafeLink, {
  base: {
    textDecoration: "underline",
    _hover: {
      textDecoration: "none",
    },
    _selected: {
      textDecoration: "none",
    },
  },
});

export const LearningpathFormStepper = ({ currentStep, id, language }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <nav aria-label={t("learningpathForm.stepper.navigation")}>
        <DesktopStepper currentStep={currentStep} language={language} id={id} />
      </nav>
      <MobileStepper currentStep={currentStep} language={language} id={id} />
    </>
  );
};

const DesktopStepper = ({ currentStep, language, id }: Props) => {
  const { t } = useTranslation();

  return (
    <StepWrapper>
      {STEPS.map((key, idx) => (
        <Step key={idx}>
          <NumberText aria-selected={currentStep === key}>
            <span>{idx + 1}</span>
          </NumberText>
          <StyledSafeLink
            aria-label={t(`learningpathForm.stepper.titles.${key}`)}
            unstyled
            aria-selected={currentStep === key}
            to={toEditLearningpath(id, language, key)}
          >
            {t(`learningpathForm.stepper.titles.${key}`)}
          </StyledSafeLink>
          <Line />
        </Step>
      ))}
    </StepWrapper>
  );
};

const MobileStepWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "surface.brand.1.subtle",
    paddingInline: "xsmall",
    paddingBlock: "small",
    gap: "xsmall",
    tabletWide: {
      display: "none",
    },
  },
});

const StepCircle = styled("div", {
  base: {
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    height: "xxlarge",
    width: "xxlarge",
    borderRadius: "150px",
    border: "2px solid",
    borderColor: "stroke.info",
    transform: "rotate(45deg)",
  },
  defaultVariants: {
    step: "metadata",
  },
  variants: {
    step: {
      metadata: {
        borderTopColor: "stroke.default",
      },
      steps: {
        borderTopColor: "stroke.default",
        borderRightColor: "stroke.default",
      },
      preview: {
        borderTopColor: "stroke.default",
        borderRightColor: "stroke.default",
        borderBottomColor: "stroke.default",
      },
      status: {
        borderTopColor: "stroke.default",
        borderRightColor: "stroke.default",
        borderBottomColor: "stroke.default",
        borderLeftColor: "stroke.default",
      },
    },
  },
});

const CounterText = styled(Text, {
  base: {
    transform: "rotate(-45deg)",
  },
});

const MobileStepper = ({ currentStep }: Props) => {
  const index = STEPS.indexOf(currentStep);
  const { t } = useTranslation();

  return (
    <MobileStepWrapper>
      <StepCircle step={currentStep}>
        <CounterText consumeCss asChild>
          <span>{index + 1}/4</span>
        </CounterText>
      </StepCircle>
      <Stack align="start" gap="4xsmall">
        <Text fontWeight="bold" textStyle="label.medium">
          {t(`learningpathForm.stepper.titles.${currentStep}`)}
        </Text>
        {index !== 3 ? (
          <Text textStyle="label.small">
            {t("learningpathForm.stepper.next", {
              next: t(`learningpathForm.stepper.titles.${currentStep}`),
            })}
          </Text>
        ) : null}
      </Stack>
    </MobileStepWrapper>
  );
};
