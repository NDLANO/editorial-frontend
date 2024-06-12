/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { Node } from "@ndla/types-taxonomy";
import { Text } from "@ndla/typography";
import { gradeItemStyles, qualityEvaluationOptions } from "./QualityEvaluationForm";
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
  taxonomy?: Node[];
}

const QualityEvaluation = ({ articleType, taxonomy }: Props) => {
  const { t } = useTranslation();
  const qualityEvaluation = taxonomy?.[0].qualityEvaluation;

  return (
    <FlexWrapper>
      <Text margin="none" textStyle="button">
        {`${t("qualityEvaluationForm.title")}:`}
      </Text>
      {qualityEvaluation?.grade ? (
        <GradeItem
          title={qualityEvaluation?.note}
          aria-label={qualityEvaluation?.note}
          style={
            {
              "--item-color": qualityEvaluationOptions[qualityEvaluation?.grade],
            } as CSSProperties
          }
          data-border={qualityEvaluation?.grade === 1 || qualityEvaluation?.grade === 5}
        >
          {qualityEvaluation?.grade}
        </GradeItem>
      ) : (
        <StyledNoEvaluation margin="none" textStyle="button">
          {t("qualityEvaluationForm.unavailable")}
        </StyledNoEvaluation>
      )}
      <QualityEvaluationModal articleType={articleType} taxonomy={taxonomy} />
    </FlexWrapper>
  );
};

export default QualityEvaluation;
