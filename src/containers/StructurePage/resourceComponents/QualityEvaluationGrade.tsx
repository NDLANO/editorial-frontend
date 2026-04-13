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
import { CSSProperties } from "react";
import {
  qualityEvaluationOptionColors,
  QualityEvaluationValue,
} from "../../../components/QualityEvaluation/qualityEvaluationOptions";

const GradeItem = styled(Text, {
  base: {
    border: "2px solid",
    borderRadius: "xsmall",
    paddingInline: "xxsmall",
    borderColor: "var(--border-color)",
  },
});

const RequiresTechnicalEvaluationIcon = styled("span", { base: { fontSize: "xxsmall" } });

interface Props extends HTMLArkProps<"p"> {
  grade: number | undefined;
  averageGrade?: string;
  requiresTechnicalEvaluation?: boolean;
  tooltip: string | undefined;
}

const QualityEvaluationGrade = ({
  grade,
  textStyle = "body.small",
  fontWeight = "bold",
  color = "text.default",
  averageGrade,
  requiresTechnicalEvaluation,
  tooltip,
  ...rest
}: Props & TextProps) => {
  if (!grade && !averageGrade) return;

  const roundedGrade = Math.round(grade ?? Math.round(Number(averageGrade!)));

  return (
    <GradeItem
      style={
        {
          "--border-color": qualityEvaluationOptionColors[roundedGrade.toString() as QualityEvaluationValue],
        } as CSSProperties
      }
      title={tooltip}
      aria-label={tooltip}
      textStyle={textStyle}
      fontWeight={fontWeight}
      color={color}
      {...rest}
    >
      {averageGrade ?? grade}
      {requiresTechnicalEvaluation ? <RequiresTechnicalEvaluationIcon>＊</RequiresTechnicalEvaluationIcon> : null}
    </GradeItem>
  );
};

export default QualityEvaluationGrade;
