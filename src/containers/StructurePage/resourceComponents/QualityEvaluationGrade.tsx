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

const GradeItem = styled(Text)`
  border: 2px solid var(--item-color);
  border-radius: ${misc.borderRadius};
  padding: 0px ${spacing.xxsmall};
  line-height: 18px;
`;

const StyledQualityText = styled(Text)`
  white-space: nowrap;
`;

interface Props {
  grade: number | undefined;
  ariaLabel: string;
  titleText?: string;
}

const QualityEvaluationGrade = ({ grade, ariaLabel, titleText }: Props) => {
  if (!grade) return;

  return (
    <>
      {titleText && (
        <StyledQualityText margin="none" textStyle="meta-text-small">
          {titleText}
        </StyledQualityText>
      )}
      <GradeItem
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
        {grade}
      </GradeItem>
    </>
  );
};

export default QualityEvaluationGrade;
