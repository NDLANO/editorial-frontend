/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors } from "@ndla/core";
import { GradeAverage } from "@ndla/types-taxonomy";
import { Text } from "@ndla/typography";
import QualityEvaluationGrade from "../../containers/StructurePage/resourceComponents/QualityEvaluationGrade";

const StyledNoEvaluation = styled(Text)`
  color: ${colors.brand.greyMedium};
  font-style: italic;
`;

interface Props {
  gradeAverage: GradeAverage | undefined;
  nodeType: string;
}

const AverageQualityEvaluation = ({ gradeAverage, nodeType }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Text margin="none" textStyle="button">
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
        <StyledNoEvaluation margin="none" textStyle="button">
          {t("qualityEvaluationForm.unavailable")}
        </StyledNoEvaluation>
      )}
    </>
  );
};

export default AverageQualityEvaluation;
