/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldHelperProps, FieldInputProps } from "formik";
import { useTranslation } from "react-i18next";
import { Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IArticle, IUpdatedArticle } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import QualityEvaluationModal from "./QualityEvaluationModal";
import { ArticleFormType } from "../../containers/FormikForm/articleFormHooks";
import SmallQualityEvaluationGrade from "../../containers/StructurePage/resourceComponents/QualityEvaluationGrade";

const FlexWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "3xsmall",
  },
});

interface Props {
  articleType?: string;
  article?: IArticle;
  taxonomy?: Node[];
  revisionMetaField?: FieldInputProps<ArticleFormType["revisionMeta"]>;
  revisionMetaHelpers?: FieldHelperProps<ArticleFormType["revisionMeta"]>;
  updateNotes?: (art: IUpdatedArticle) => Promise<IArticle>;
}

const QualityEvaluation = ({
  articleType,
  article,
  taxonomy,
  revisionMetaField,
  revisionMetaHelpers,
  updateNotes,
}: Props) => {
  const { t } = useTranslation();
  // Since quality evaluation is the same every place the resource is used in taxonomy, we can use the first node
  const qualityEvaluation = taxonomy?.[0]?.qualityEvaluation;

  return (
    <FlexWrapper>
      <Text textStyle="label.small" fontWeight="semibold">{`${t("qualityEvaluationForm.title")}:`}</Text>
      {qualityEvaluation?.grade ? (
        <SmallQualityEvaluationGrade grade={qualityEvaluation.grade} tooltip={qualityEvaluation?.note} />
      ) : (
        <Text textStyle="label.small" color="text.subtle">
          {t("qualityEvaluationForm.unavailable")}
        </Text>
      )}
      <QualityEvaluationModal
        articleType={articleType}
        article={article}
        taxonomy={taxonomy}
        revisionMetaField={revisionMetaField}
        revisionMetaHelpers={revisionMetaHelpers}
        updateNotes={updateNotes}
      />
    </FlexWrapper>
  );
};

export default QualityEvaluation;
