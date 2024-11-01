/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldHelperProps, FieldInputProps } from "formik";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { IArticle, IUpdatedArticle } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import { Text } from "@ndla/typography";
import QualityEvaluationModal from "./QualityEvaluationModal";
import { ArticleFormType } from "../../containers/FormikForm/articleFormHooks";
import SmallQualityEvaluationGrade from "../../containers/StructurePage/resourceComponents/QualityEvaluationGrade";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xsmall};
`;

const StyledNoEvaluation = styled(Text)`
  color: ${colors.brand.greyMedium};
  font-style: italic;
`;

interface Props {
  articleType?: string;
  article?: IArticle;
  taxonomy?: Node[];
  iconButtonColor?: "light" | "primary";
  revisionMetaField?: FieldInputProps<ArticleFormType["revisionMeta"]>;
  revisionMetaHelpers?: FieldHelperProps<ArticleFormType["revisionMeta"]>;
  updateNotes?: (art: IUpdatedArticle) => Promise<IArticle>;
}

const QualityEvaluation = ({
  articleType,
  article,
  taxonomy,
  iconButtonColor,
  revisionMetaField,
  revisionMetaHelpers,
  updateNotes,
}: Props) => {
  const { t } = useTranslation();
  // Since quality evaluation is the same every place the resource is used in taxonomy, we can use the first node
  const qualityEvaluation = taxonomy?.[0]?.qualityEvaluation;

  return (
    <FlexWrapper>
      <Text margin="none" textStyle="button">
        {`${t("qualityEvaluationForm.title")}:`}
      </Text>
      {qualityEvaluation?.grade ? (
        <>
          <SmallQualityEvaluationGrade grade={qualityEvaluation.grade} tooltip={qualityEvaluation?.note} />
        </>
      ) : (
        <StyledNoEvaluation margin="none" textStyle="button">
          {t("qualityEvaluationForm.unavailable")}
        </StyledNoEvaluation>
      )}
      <QualityEvaluationModal
        articleType={articleType}
        article={article}
        taxonomy={taxonomy}
        iconButtonColor={iconButtonColor}
        revisionMetaField={revisionMetaField}
        revisionMetaHelpers={revisionMetaHelpers}
        updateNotes={updateNotes}
      />
    </FlexWrapper>
  );
};

export default QualityEvaluation;
