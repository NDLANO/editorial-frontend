/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import QualityEvaluationGrade from "./QualityEvaluationGrade";
import { ResourceWithNodeConnectionAndMeta } from "./StructureResources";

const QualityInfoWrapper = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
  align-items: center;
`;

interface Props {
  currentNode: ResourceWithNodeConnectionAndMeta;
  resourceCount: number;
}

const QualityEvaluationInfo = ({ currentNode, resourceCount }: Props) => {
  const { t } = useTranslation();

  return (
    <QualityInfoWrapper>
      {currentNode.qualityEvaluation?.grade && (
        <QualityEvaluationGrade
          grade={currentNode.qualityEvaluation.grade}
          ariaLabel={t("taxonomy.qualityDescriptionTopic")}
          titleText={t("taxonomy.topicArticle")}
        />
      )}
      {currentNode.gradeAverage?.averageValue && currentNode.gradeAverage.count === resourceCount && (
        <QualityEvaluationGrade
          grade={currentNode.gradeAverage.averageValue}
          ariaLabel={t("taxonomy.qualityDescription")}
          titleText={t("taxonomy.fullTopic")}
        />
      )}
    </QualityInfoWrapper>
  );
};

export default QualityEvaluationInfo;
