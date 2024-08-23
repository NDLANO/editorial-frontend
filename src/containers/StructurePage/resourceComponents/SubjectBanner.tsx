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
import { Node } from "@ndla/types-taxonomy";
import { Text } from "@ndla/typography";
import JumpToStructureButton from "./JumpToStructureButton";
import AverageQualityEvaluation from "../../../components/QualityEvaluation/AverageQualityEvaluation";
import QualityEvaluation from "../../../components/QualityEvaluation/QualityEvaluation";
import config from "../../../config";
import { BannerWrapper, FlexContentWrapper, TitleRow, TopInfoRow } from "../styles";

const StyledNoEvaluation = styled(Text)`
  color: ${colors.brand.greyMedium};
  font-style: italic;
`;

interface Props {
  subjectNode: Node;
}

const SubjectBanner = ({ subjectNode }: Props) => {
  const { t } = useTranslation();

  return (
    <BannerWrapper>
      <TopInfoRow>
        <FlexContentWrapper>
          <JumpToStructureButton nodeId={subjectNode.id} />
        </FlexContentWrapper>
        <FlexContentWrapper>
          {config.qualityEvaluationEnabled === true && (
            <>
              <AverageQualityEvaluation averageGrade={subjectNode.gradeAverage?.averageValue} nodeType="SUBJECT" />
              <QualityEvaluation
                articleType="subject"
                taxonomy={[subjectNode]}
                iconButtonColor="primary"
                gradeVariant="small"
              />
            </>
          )}
        </FlexContentWrapper>
      </TopInfoRow>
      <TitleRow>
        <Text textStyle="button" margin="none">
          {subjectNode.name}
        </Text>
      </TitleRow>
    </BannerWrapper>
  );
};

export default SubjectBanner;
