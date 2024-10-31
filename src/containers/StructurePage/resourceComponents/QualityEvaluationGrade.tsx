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
import { QualityEvaluationValue } from "../../../components/QualityEvaluation/QualityEvaluationForm";

// TODO: We should change these colors
const qualityEvaluationOptions: Record<QualityEvaluationValue, string> = {
  "1": "#5cbc80",
  "2": "#90C670",
  "3": "#C3D060",
  "4": "#ead854",
  "5": "#d1372e",
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
  fontWeight = "bold",
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
      fontWeight={fontWeight}
      color={color}
      {...rest}
    >
      {averageGrade ?? grade}
    </GradeItem>
  );
};

export default QualityEvaluationGrade;
