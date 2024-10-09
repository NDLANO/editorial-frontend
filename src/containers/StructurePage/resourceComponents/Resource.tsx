/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { ContentTypeBadge } from "@ndla/ui";
import GrepCodesModal from "./GrepCodesModal";
import QualityEvaluationGrade from "./QualityEvaluationGrade";
import ResourceItemLink from "./ResourceItemLink";
import StatusIcons from "./StatusIcons";
import { ResourceWithNodeConnectionAndMeta } from "./StructureResources";
import VersionHistory from "./VersionHistory";
import RelevanceOption from "../../../components/Taxonomy/RelevanceOption";
import { getContentTypeFromResourceTypes } from "../../../util/resourceHelpers";
import {
  BoldFont,
  ButtonRow,
  CardWrapper,
  ResourceCardContentWrapper,
  StyledResourceCard,
  StyledResourceIcon,
  StyledResponsibleBadge,
} from "../styles";

const StyledResourceBody = styled.div`
  flex: 1 1 auto;
  justify-content: space-between;
  text-align: left;
`;

const StyledText = styled.div`
  display: flex;
  box-shadow: none;
  align-items: center;
`;

const BadgeWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const RemoveButton = styled(ButtonV2)`
  flex: 0;
`;

interface Props {
  currentNodeId: string;
  responsible?: string;
  resource: ResourceWithNodeConnectionAndMeta;
  onDelete: (connectionId: string) => void;
  contentMetaLoading: boolean;
  showQuality: boolean;
}

const Resource = ({ resource, onDelete, currentNodeId, contentMetaLoading, responsible, showQuality }: Props) => {
  const { t } = useTranslation();
  const location = useLocation();

  const contentType = getContentTypeFromResourceTypes(resource.resourceTypes);
  const contentTypeName = resource.resourceTypes[resource.resourceTypes.length - 1].name;

  const structurePaths: string[] = location.pathname.replace("/structure", "").split("/");
  const currentPath = structurePaths.map((p) => p.replace("urn:", "")).join("/");
  const path = resource.paths.find((p) => {
    const pArr = p.split("/");
    const isResource = pArr[pArr.length - 1].startsWith("resource");
    const pathWithoutResource = pArr.slice(0, pArr.length - (isResource ? 1 : 0)).join("/");
    return pathWithoutResource === currentPath;
  });

  return (
    <CardWrapper>
      <StyledResourceCard>
        <BadgeWrapper>
          {contentType && (
            <StyledResourceIcon key="img">
              <ContentTypeBadge
                aria-label={contentTypeName}
                background
                type={contentType}
                size="x-small"
                title={contentTypeName}
              />
            </StyledResourceIcon>
          )}
        </BadgeWrapper>
        <ResourceCardContentWrapper>
          <StyledText data-testid={`resource-type-${contentType}`}>
            <StyledResourceBody key="body">
              <ResourceItemLink
                contentType={contentType}
                contentUri={resource.contentUri}
                name={resource.name}
                isVisible={resource.metadata?.visible}
                size="small"
              />
            </StyledResourceBody>
            {showQuality && (
              <QualityEvaluationGrade
                grade={resource.qualityEvaluation?.grade}
                tooltip={
                  resource.qualityEvaluation?.note
                    ? `${t("qualityEvaluationForm.title")}: ${resource.qualityEvaluation?.note}`
                    : t("qualityEvaluationForm.title")
                }
              />
            )}
            <StatusIcons
              contentMetaLoading={contentMetaLoading}
              resource={resource}
              multipleTaxonomy={resource.contexts?.length > 1}
              path={path}
            />
            <RelevanceOption resource={resource} currentNodeId={currentNodeId} />
          </StyledText>
          <ButtonRow>
            <StyledResponsibleBadge>
              <BoldFont>{`${t("form.responsible.label")}: `}</BoldFont>
              {responsible ?? t("form.responsible.noResponsible")}
            </StyledResponsibleBadge>
            <GrepCodesModal
              codes={resource.contentMeta?.grepCodes ?? []}
              contentType={contentType}
              contentUri={resource.contentUri}
              revision={resource.contentMeta?.revision}
              currentNodeId={currentNodeId}
            />
            <VersionHistory resource={resource} contentType={contentType} />
            <RemoveButton onClick={() => onDelete(resource.connectionId)} size="xsmall" colorTheme="danger">
              {t("form.remove")}
            </RemoveButton>
          </ButtonRow>
        </ResourceCardContentWrapper>
      </StyledResourceCard>
    </CardWrapper>
  );
};

export default Resource;
