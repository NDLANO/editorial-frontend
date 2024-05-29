/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import QualityEvaluationGrade from "./QualityEvaluationGrade";
import { Dictionary } from "../../../interfaces";
import { NodeResourceMeta } from "../../../modules/nodes/nodeQueries";

const QualityInfoWrapper = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
  align-items: center;
`;

const getAverageResourceGrade = (contentMeta: Dictionary<NodeResourceMeta>): number | undefined => {
  const contentMetaList = Object.values(contentMeta).filter((c) => c.articleType !== "topic-article");

  // Only display average if all resources have a grade
  if (!contentMetaList.length || contentMetaList.some((c) => !c.qualityEvaluation?.grade)) return;
  const accumulated = contentMetaList.reduce((acc, c) => {
    if (c.qualityEvaluation?.grade) return acc + Number(c.qualityEvaluation.grade);
    return acc;
  }, 0);

  const average = accumulated / contentMetaList.length;

  // One decimal if average is not an integer
  const averageFormatted = Math.round(average * 10) / 10;

  return averageFormatted;
};

interface Props {
  contentMeta: Dictionary<NodeResourceMeta>;
}

const QualityEvaluationInfo = ({ contentMeta }: Props) => {
  const { t } = useTranslation();

  const topicArticleGrade = useMemo(
    () => Object.values(contentMeta).find((c) => c.articleType === "topic-article")?.qualityEvaluation?.grade,
    [contentMeta],
  );
  const averageResourceGrade = useMemo(() => getAverageResourceGrade(contentMeta), [contentMeta]);

  if (!topicArticleGrade && !averageResourceGrade) return null;

  return (
    <QualityInfoWrapper>
      {topicArticleGrade && (
        <QualityEvaluationGrade
          grade={topicArticleGrade}
          ariaLabel={t("taxonomy.qualityDescriptionTopic")}
          titleText={t("taxonomy.topicArticle")}
        />
      )}
      {averageResourceGrade && (
        <QualityEvaluationGrade
          grade={averageResourceGrade}
          ariaLabel={t("taxonomy.qualityDescription")}
          titleText={t("taxonomy.fullTopic")}
        />
      )}
    </QualityInfoWrapper>
  );
};

export default QualityEvaluationInfo;
