/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Node } from "@ndla/types-taxonomy";
import { Text } from "@ndla/typography";
import JumpToStructureButton from "./JumpToStructureButton";
import AverageQualityEvaluation from "../../../components/QualityEvaluation/AverageQualityEvaluation";
import QualityEvaluation from "../../../components/QualityEvaluation/QualityEvaluation";
import config from "../../../config";
import { BannerWrapper, FlexContentWrapper, TitleRow, TopInfoRow } from "../styles";

interface Props {
  subjectNode: Node;
  showQuality: boolean;
}

const SubjectBanner = ({ subjectNode, showQuality }: Props) => {
  return (
    <BannerWrapper>
      <TopInfoRow>
        <FlexContentWrapper>
          <JumpToStructureButton nodeId={subjectNode.id} />
        </FlexContentWrapper>
        <FlexContentWrapper>
          {showQuality && (
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
