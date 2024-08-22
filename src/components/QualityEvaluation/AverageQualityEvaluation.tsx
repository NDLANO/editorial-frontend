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
import { Text } from "@ndla/typography";
import QualityEvaluationGrade from "../../containers/StructurePage/resourceComponents/QualityEvaluationGrade";

const StyledNoEvaluation = styled(Text)`
  color: ${colors.brand.greyMedium};
  font-style: italic;
`;

interface Props {
  averageGrade: number | undefined;
  nodeType: string;
}

const AverageQualityEvaluation = ({ averageGrade, nodeType }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Text margin="none" textStyle="button">
        {`${t("taxonomy.average")}:`}
      </Text>
      {averageGrade ? (
        <QualityEvaluationGrade
          grade={averageGrade}
          averageGrade={averageGrade.toFixed(1)}
          ariaLabel={t("taxonomy.qualityDescription", { nodeType: t(`taxonomy.${nodeType}`) })}
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
