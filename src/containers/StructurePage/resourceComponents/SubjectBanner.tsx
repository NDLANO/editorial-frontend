/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "@ndla/primitives";
import { Node } from "@ndla/types-taxonomy";
import JumpToStructureButton from "./JumpToStructureButton";
import AverageQualityEvaluation from "../../../components/QualityEvaluation/AverageQualityEvaluation";
import QualityEvaluation from "../../../components/QualityEvaluation/QualityEvaluation";
import { Auth0UserData, Dictionary } from "../../../interfaces";
import { BannerWrapper, FlexContentWrapper, TopInfoRow } from "../styles";

interface Props {
  subjectNode: Node;
  showQuality: boolean;
  users: Dictionary<Auth0UserData> | undefined;
}

const SubjectBanner = ({ subjectNode, showQuality, users }: Props) => {
  const { t } = useTranslation();

  const subjectResponsibles = useMemo(
    () => ({
      LMA:
        subjectNode.metadata?.customFields.subjectLMA && users
          ? users[subjectNode.metadata.customFields.subjectLMA]
          : undefined,
      DA:
        subjectNode.metadata?.customFields.subjectDA && users
          ? users[subjectNode.metadata.customFields.subjectDA]
          : undefined,

      SA:
        subjectNode.metadata?.customFields.subjectSA && users
          ? users[subjectNode.metadata.customFields.subjectSA]
          : undefined,
    }),
    [
      subjectNode.metadata.customFields.subjectDA,
      subjectNode.metadata.customFields.subjectLMA,
      subjectNode.metadata.customFields.subjectSA,
      users,
    ],
  );

  return (
    <BannerWrapper>
      <TopInfoRow>
        <FlexContentWrapper>
          <JumpToStructureButton nodeId={subjectNode.id} />
        </FlexContentWrapper>
        <FlexContentWrapper>
          {showQuality && (
            <>
              <AverageQualityEvaluation gradeAverage={subjectNode.gradeAverage} nodeType="SUBJECT" />
              <QualityEvaluation articleType="subject" taxonomy={[subjectNode]} iconButtonColor="primary" />
            </>
          )}
        </FlexContentWrapper>
      </TopInfoRow>
      <div>
        <Text fontWeight="bold">{subjectNode.name}</Text>
        {Object.entries(subjectResponsibles).map(([key, value]) => (
          <Text key={key}>
            {key}: {value ? value.name : t("taxonomy.noValue")}
          </Text>
        ))}
      </div>
    </BannerWrapper>
  );
};

export default SubjectBanner;
