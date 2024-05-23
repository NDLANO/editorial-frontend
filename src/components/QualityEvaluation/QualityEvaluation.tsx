/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { Text } from "@ndla/typography";
import { QualityEvaluationFormValues, gradeItemStyles, qualityEvaluationOptions } from "./QualityEvaluationForm";
import QualityEvaluationModal from "./QualityEvaluationModal";

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
  articleType?: string;
}

const QualityEvaluation = ({ articleType }: Props) => {
  const { t } = useTranslation();

  const [qualityEvaluationField] = useField<QualityEvaluationFormValues>("qualityEvaluation");

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
              "--item-color": qualityEvaluationOptions[qualityEvaluationField.value?.grade],
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
      <QualityEvaluationModal articleType={articleType} />
    </FlexWrapper>
  );
};

export default QualityEvaluation;
