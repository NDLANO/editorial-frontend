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
import { useQueryClient } from "@tanstack/react-query";
import { ButtonV2 } from "@ndla/button";
import { colors, spacing, breakpoints, fonts } from "@ndla/core";
import { NodeConnectionPUT, NodeChild } from "@ndla/types-taxonomy";
import { ContentTypeBadge } from "@ndla/ui";
import GrepCodesModal from "./GrepCodesModal";
import ResourceItemLink from "./ResourceItemLink";
import StatusIcons from "./StatusIcons";
import { ResourceWithNodeConnectionAndMeta } from "./StructureResources";
import VersionHistory from "./VersionHistory";
import RelevanceOption from "../../../components/Taxonomy/RelevanceOption";
import { usePutResourceForNodeMutation, useUpdateNodeConnectionMutation } from "../../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../../modules/nodes/nodeQueries";
import { getContentTypeFromResourceTypes } from "../../../util/resourceHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  margin-bottom: ${spacing.xsmall};
`;

const StyledCard = styled.div`
  border: 1px solid ${colors.brand.lighter};
  border-radius: 5px;
  width: 100%;
  padding: 5px;
  display: flex;
`;

const StyledResourceIcon = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
  width: 42px;
  box-sizing: content-box;
  padding-right: ${spacing.small};

  @media (min-width: ${breakpoints.tablet}) {
    padding-right: ${spacing.normal};
  }
`;

const StyledResourceBody = styled.div`
  flex: 1 1 auto;
  justify-content: space-between;
  text-align: left;
`;

const StyledText = styled.div`
  display: flex;
  margin-bottom: ${spacing.xxsmall};
  box-shadow: none;
  align-items: center;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${spacing.xsmall};
`;

const BadgeWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const ContentWrapper = styled.div`
  width: 100%;
`;

const RemoveButton = styled(ButtonV2)`
  flex: 0;
`;

const StyledResponsibleBadge = styled.div`
  height: ${spacing.normal};
  border-radius: 4px;
  color: ${colors.brand.dark};
  ${fonts.sizes(14)};
  flex: 6;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const BoldFont = styled.span`
  font-weight: ${fonts.weight.semibold};
`;

interface Props {
  currentNodeId: string;
  responsible?: string;
  resource: ResourceWithNodeConnectionAndMeta;
  onDelete?: (connectionId: string) => void;
  contentMetaLoading: boolean;
  className?: string;
}

const Resource = ({ resource, onDelete, currentNodeId, contentMetaLoading, responsible, className }: Props) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const qc = useQueryClient();
  const { taxonomyVersion } = useTaxonomyVersion();
  const compKey = nodeQueryKeys.resources({
    id: currentNodeId,
    language: i18n.language,
  });

  const onUpdateConnection = async (id: string, { relevanceId }: NodeConnectionPUT) => {
    await qc.cancelQueries({ queryKey: compKey });
    const resources = qc.getQueryData<NodeChild[]>(compKey) ?? [];
    if (relevanceId) {
      const newResources = resources.map((res) => {
        if (res.id === id) {
          return { ...res, relevanceId: relevanceId };
        } else return res;
      });
      qc.setQueryData<NodeChild[]>(compKey, newResources);
    }
    return resources;
  };

  const { mutateAsync: updateNodeConnection } = useUpdateNodeConnectionMutation({
    onMutate: async ({ id, body }) => onUpdateConnection(id, body),
    onSettled: () => qc.invalidateQueries({ queryKey: compKey }),
  });
  const { mutateAsync: updateResourceConnection } = usePutResourceForNodeMutation({
    onMutate: async ({ id, body }) => onUpdateConnection(id, body),
    onSettled: () => qc.invalidateQueries({ queryKey: compKey }),
  });

  const contentType =
    resource.resourceTypes.length > 0
      ? getContentTypeFromResourceTypes(resource.resourceTypes).contentType
      : "topic-article";

  const contentTypeName =
    resource.resourceTypes.length > 0
      ? resource.resourceTypes[resource.resourceTypes.length - 1].name
      : t("searchForm.articleType.topicArticle");

  const iconType = contentType === "topic-article" ? "topic" : contentType;

  const structurePaths: string[] = location.pathname.replace("/structure", "").split("/");
  const currentPath = structurePaths.map((p) => p.replace("urn:", "")).join("/");
  const path = resource.paths.find((p) => {
    const pArr = p.split("/");
    const isResource = pArr[pArr.length - 1].startsWith("resource");
    const pathWithoutResource = pArr.slice(0, pArr.length - (isResource ? 1 : 0)).join("/");
    return pathWithoutResource === currentPath;
  });

  const updateRelevanceId = async (relevanceId: string) => {
    const { connectionId, isPrimary, rank } = resource;
    const func = connectionId.includes("-resource") ? updateResourceConnection : updateNodeConnection;
    await func({
      id: connectionId,
      body: { relevanceId, primary: isPrimary, rank: rank },
      taxonomyVersion,
    });
  };

  return (
    <Wrapper className={className}>
      <StyledCard>
        <BadgeWrapper>
          {contentType && (
            <StyledResourceIcon key="img">
              <ContentTypeBadge
                aria-label={contentTypeName}
                background
                type={iconType}
                size="x-small"
                title={contentTypeName}
              />
            </StyledResourceIcon>
          )}
        </BadgeWrapper>
        <ContentWrapper>
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
            <StatusIcons contentMetaLoading={contentMetaLoading} resource={resource} path={path} />
            <RelevanceOption relevanceId={resource.relevanceId} onChange={updateRelevanceId} />
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
            <RemoveButton
              onClick={() => (onDelete ? onDelete(resource.connectionId) : null)}
              size="xsmall"
              colorTheme="danger"
              disabled={!onDelete}
            >
              {t("form.remove")}
            </RemoveButton>
          </ButtonRow>
        </ContentWrapper>
      </StyledCard>
    </Wrapper>
  );
};

export default Resource;
