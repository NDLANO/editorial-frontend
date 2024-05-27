/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing, misc } from "@ndla/core";
import { Text } from "@ndla/typography";
import { qualityEvaluationOptions } from "../../../components/QualityEvaluation/QualityEvaluationForm";
import { Dictionary } from "../../../interfaces";
import { NodeResourceMeta } from "../../../modules/nodes/nodeQueries";

const GradeItem = styled.div`
  border: 2px solid var(--item-color);
  border-radius: ${misc.borderRadius};
  padding: 0px ${spacing.xxsmall};
`;

const StyledQualityText = styled(Text)`
  white-space: nowrap;
`;
const QualityInfoWrapper = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
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
        <>
          <StyledQualityText margin="none" textStyle="meta-text-small">
            {t("taxonomy.topicArticle")}
          </StyledQualityText>
          <GradeItem
            title={t("taxonomy.qualityDescriptionTopic")}
            aria-label={t("taxonomy.qualityDescriptionTopic")}
            style={
              {
                "--item-color": qualityEvaluationOptions[Number(topicArticleGrade.toFixed())],
              } as CSSProperties
            }
          >
            {topicArticleGrade}
          </GradeItem>
        </>
      )}
      {averageResourceGrade && (
        <>
          <StyledQualityText margin="none" textStyle="meta-text-small">
            {t("taxonomy.fullTopic")}
          </StyledQualityText>
          <GradeItem
            title={t("taxonomy.qualityDescription")}
            aria-label={t("taxonomy.qualityDescription")}
            style={
              {
                "--item-color": qualityEvaluationOptions[Number(averageResourceGrade.toFixed())],
              } as CSSProperties
            }
          >
            {averageResourceGrade}
          </GradeItem>
        </>
      )}
    </QualityInfoWrapper>
  );
};

export default QualityEvaluationInfo;
