/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HTMLArkProps } from "@ark-ui/react";
import { Text, TextProps } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ColorToken } from "@ndla/styled-system/tokens";
import { QualityEvaluationValue } from "../../../components/QualityEvaluation/QualityEvaluationForm";

const qualityEvaluationOptions: Record<QualityEvaluationValue, ColorToken> = {
  "1": "surface.brand.3.moderate",
  "2": "surface.brand.3",
  "3": "surface.brand.4.moderate",
  "4": "surface.brand.4",
  "5": "surface.brand.5",
};

const GradeItem = styled(Text, {
  base: {
    border: "2px solid",
    borderRadius: "xsmall",
    paddingInline: "xxsmall",
    borderColor: "var(--border-color)",
  },
  variants: {
    quality: {
      "1": {
        borderColor: qualityEvaluationOptions["1"],
      },

      "2": {
        borderColor: qualityEvaluationOptions["2"],
      },

      "3": {
        borderColor: qualityEvaluationOptions["3"],
      },
      "4": {
        borderColor: qualityEvaluationOptions["4"],
      },
      "5": {
        borderColor: qualityEvaluationOptions["5"],
      },
    },
  },
});

interface Props extends HTMLArkProps<"p"> {
  grade: number | undefined;
  averageGrade?: string;
  tooltip: string | undefined;
}

const QualityEvaluationGrade = ({
  grade,
  textStyle = "body.small",
  color = "text.default",
  averageGrade,
  tooltip,
  ...rest
}: Props & TextProps) => {
  if (!grade && !averageGrade) return;

  const roundedGrade = Math.round(grade ?? Math.round(Number(averageGrade!)));

  return (
    <GradeItem
      quality={roundedGrade.toString() as QualityEvaluationValue}
      title={tooltip}
      aria-label={tooltip}
      textStyle={textStyle}
      color={color}
      {...rest}
    >
      {averageGrade ?? grade}
    </GradeItem>
  );
};

export default QualityEvaluationGrade;
