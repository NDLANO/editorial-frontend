/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldHelperProps, FieldInputProps } from "formik";
import { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { Node } from "@ndla/types-taxonomy";
import { Text } from "@ndla/typography";
import { gradeItemStyles, qualityEvaluationOptions } from "./QualityEvaluationForm";
import QualityEvaluationModal from "./QualityEvaluationModal";
import { RevisionMetaFormType } from "../../containers/FormikForm/AddRevisionDateField";
import SmallQualityEvaluationGrade from "../../containers/StructurePage/resourceComponents/QualityEvaluationGrade";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xsmall};
`;

const LargeGradeItem = styled.div`
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
  iconButtonColor?: "light" | "primary";
  revisionMetaField?: FieldInputProps<RevisionMetaFormType>;
  revisionMetaHelpers?: FieldHelperProps<RevisionMetaFormType>;
  gradeVariant?: "small" | "large";
}

const QualityEvaluation = ({
  articleType,
  taxonomy,
  iconButtonColor,
  revisionMetaField,
  revisionMetaHelpers,
  gradeVariant = "large",
}: Props) => {
  const { t } = useTranslation();
  // Since quality evaluation is the same every place the resource is used in taxonomy, we can use the first node
  const qualityEvaluation = taxonomy?.[0].qualityEvaluation;

  return (
    <FlexWrapper>
      <Text margin="none" textStyle="button">
        {`${t("qualityEvaluationForm.title")}:`}
      </Text>
      {qualityEvaluation?.grade ? (
        <>
          {gradeVariant === "large" && (
            <LargeGradeItem
              title={qualityEvaluation?.note}
              aria-label={qualityEvaluation?.note}
              style={
                {
                  "--item-color": qualityEvaluationOptions[qualityEvaluation.grade],
                } as CSSProperties
              }
              data-border={qualityEvaluation.grade === 1 || qualityEvaluation.grade === 5}
            >
              {qualityEvaluation?.grade}
            </LargeGradeItem>
          )}
          {gradeVariant === "small" && (
            <SmallQualityEvaluationGrade grade={qualityEvaluation.grade} ariaLabel={qualityEvaluation?.note} />
          )}
        </>
      ) : (
        <StyledNoEvaluation margin="none" textStyle="button">
          {t("qualityEvaluationForm.unavailable")}
        </StyledNoEvaluation>
      )}
      <QualityEvaluationModal
        articleType={articleType}
        taxonomy={taxonomy}
        iconButtonColor={iconButtonColor}
        revisionMetaField={revisionMetaField}
        revisionMetaHelpers={revisionMetaHelpers}
      />
    </FlexWrapper>
  );
};

export default QualityEvaluation;
