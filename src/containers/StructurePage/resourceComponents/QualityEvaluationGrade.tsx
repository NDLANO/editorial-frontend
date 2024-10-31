/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties } from "react";
import styled from "@emotion/styled";
import { spacing, misc } from "@ndla/core";
import { Text } from "@ndla/typography";
import { qualityEvaluationOptions } from "../../../components/QualityEvaluation/QualityEvaluationForm";

const SmallGradeItem = styled(Text)`
  border: 2px solid var(--item-color);
  border-radius: ${misc.borderRadius};
  padding: 0px ${spacing.xxsmall};
  line-height: 18px;
`;

interface Props {
  grade: number | undefined;
  averageGrade?: string;
  ariaLabel?: string;
}

const QualityEvaluationGrade = ({ grade, averageGrade, ariaLabel }: Props) => {
  if (!grade) return;

  return (
    <SmallGradeItem
      title={ariaLabel}
      aria-label={ariaLabel}
      style={
        {
          "--item-color": qualityEvaluationOptions[Number(grade.toFixed())],
        } as CSSProperties
      }
      margin="none"
      textStyle="button"
    >
      {averageGrade ?? grade}
    </SmallGradeItem>
  );
};

export default QualityEvaluationGrade;
