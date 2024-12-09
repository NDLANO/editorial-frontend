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
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import JumpToStructureButton from "./JumpToStructureButton";
import AverageQualityEvaluation from "../../../components/QualityEvaluation/AverageQualityEvaluation";
import QualityEvaluation from "../../../components/QualityEvaluation/QualityEvaluation";
import config from "../../../config";
import { Auth0UserData, Dictionary } from "../../../interfaces";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

const ResourceGroupBanner = styled("div", {
  base: {
    backgroundColor: "surface.brand.2.subtle",
    borderRadius: "xsmall",
    padding: "small",
    border: "1px solid",
    borderColor: "stroke.subtle",
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
  },
});

const ContentWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
    flexWrap: "wrap",
  },
});

const TopRow = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "3xsmall",
  },
});

interface Props {
  subjectNode: Node;
  showQuality: boolean;
  users: Dictionary<Auth0UserData> | undefined;
}

const SubjectBanner = ({ subjectNode, showQuality, users }: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

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
    <ResourceGroupBanner>
      <TopRow>
        {!!showQuality && (
          <ContentWrapper>
            <AverageQualityEvaluation gradeAverage={subjectNode.gradeAverage} nodeType="SUBJECT" />
            <QualityEvaluation articleType="subject" taxonomy={[subjectNode]} />
          </ContentWrapper>
        )}
        <JumpToStructureButton nodeId={subjectNode.id} />
      </TopRow>
      <div>
        <Text fontWeight="bold">
          <a href={`${config.ndlaFrontendDomain}${subjectNode.url}?versionHash=${taxonomyVersion}`}>
            {subjectNode.name}
          </a>
        </Text>
        {Object.entries(subjectResponsibles).map(([key, value]) => (
          <Text key={key}>
            {key}: {value ? value.name : t("taxonomy.noValue")}
          </Text>
        ))}
      </div>
    </ResourceGroupBanner>
  );
};

export default SubjectBanner;
