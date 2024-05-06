/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { CSSProperties, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { IQualityEvaluation } from "@ndla/types-backend/draft-api";
import { Text } from "@ndla/typography";
import { QualityEvaluationFormValues, gradeItemStyles } from "./QualityEvaluationForm";
import QualityEvaluationModal from "./QualityEvaluationModal";

const qualityEvaluationOptions: { value: number; color: string }[] = [
  { value: 1, color: colors.support.green },
  { value: 2, color: "#C3D060" },
  { value: 3, color: colors.support.yellow },
  { value: 4, color: "#CF9065" },
  { value: 5, color: colors.assessmentResource.dark },
];

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xsmall};
`;

const GradeItem = styled.div`
  ${gradeItemStyles}
  cursor: default;
`;

const StyledNoEvaluation = styled(Text)`
  color: ${colors.brand.greyMedium};
  font-style: italic;
`;

interface Props {
  qualityEvaluation: IQualityEvaluation | undefined;
}

const QualityEvaluation = ({ qualityEvaluation }: Props) => {
  const { t } = useTranslation();

  const [qualityEvaluationField] = useField<QualityEvaluationFormValues>("qualityEvaluation");

  const evaluationGradeColor = useMemo(
    () => qualityEvaluationOptions.find((option) => option.value === qualityEvaluationField.value?.grade)?.color,
    [qualityEvaluationField.value?.grade],
  );

  return (
    <FlexWrapper>
      <Text margin="none" textStyle="button">
        {`${t("qualityEvaluationForm.title")}:`}
      </Text>
      {qualityEvaluationField.value?.grade ? (
        <GradeItem
          title={qualityEvaluationField.value?.note}
          aria-label={qualityEvaluationField.value?.note}
          style={
            {
              "--item-color": evaluationGradeColor,
            } as CSSProperties
          }
        >
          {qualityEvaluationField.value?.grade}
        </GradeItem>
      ) : (
        <StyledNoEvaluation margin="none" textStyle="button">
          {t("qualityEvaluationForm.unavailable")}
        </StyledNoEvaluation>
      )}
      <QualityEvaluationModal qualityEvaluation={qualityEvaluation} />
    </FlexWrapper>
  );
};

export default QualityEvaluation;
