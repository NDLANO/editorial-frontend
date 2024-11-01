/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { GradeAverage } from "@ndla/types-taxonomy";
import QualityEvaluationGrade from "../../containers/StructurePage/resourceComponents/QualityEvaluationGrade";

const StyledText = styled(Text, {
  base: {
    fontStyle: "italic",
  },
});

interface Props {
  gradeAverage: GradeAverage | undefined;
  nodeType: string;
}

const AverageQualityEvaluation = ({ gradeAverage, nodeType }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Text textStyle="label.small" fontWeight="semibold">
        {`${t("taxonomy.average")}:`}
      </Text>
      {gradeAverage ? (
        <QualityEvaluationGrade
          grade={gradeAverage.averageValue}
          averageGrade={gradeAverage.averageValue.toFixed(1)}
          tooltip={t("taxonomy.qualityDescription", {
            nodeType: t(`taxonomy.${nodeType}`),
            count: gradeAverage.count,
          })}
        />
      ) : (
        <StyledText textStyle="body.small" fontWeight="bold" color="text.subtle">
          {t("qualityEvaluationForm.unavailable")}
        </StyledText>
      )}
    </>
  );
};

export default AverageQualityEvaluation;
