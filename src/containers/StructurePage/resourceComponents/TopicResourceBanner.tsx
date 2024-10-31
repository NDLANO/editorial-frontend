/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { Comment } from "@ndla/icons/common";
import { Text } from "@ndla/primitives";
import { Node, NodeChild, ResourceType } from "@ndla/types-taxonomy";
import { ContentTypeBadge } from "@ndla/ui";
import ApproachingRevisionDate from "./ApproachingRevisionDate";
import GrepCodesModal from "./GrepCodesModal";
import GroupResourceSwitch from "./GroupResourcesSwitch";
import JumpToStructureButton from "./JumpToStructureButton";
import ResourceItemLink from "./ResourceItemLink";
import StatusIcons from "./StatusIcons";
import { ResourceWithNodeConnectionAndMeta } from "./StructureResources";
import VersionHistory from "./VersionHistory";
import AverageQualityEvaluation from "../../../components/QualityEvaluation/AverageQualityEvaluation";
import QualityEvaluation from "../../../components/QualityEvaluation/QualityEvaluation";
import RelevanceOption from "../../../components/Taxonomy/RelevanceOption";
import { PUBLISHED } from "../../../constants";
import { Dictionary } from "../../../interfaces";
import { NodeResourceMeta } from "../../../modules/nodes/nodeQueries";
import { stripInlineContentHtmlTags } from "../../../util/formHelper";
import PlannedResourceModal from "../plannedResource/PlannedResourceModal";
import {
  BannerWrapper,
  BoldFont,
  ButtonRow,
  CardWrapper,
  FlexContentWrapper,
  ResourceCardContentWrapper,
  StyledResourceCard,
  StyledResourceIcon,
  StyledResponsibleBadge,
  TitleRow,
  TopInfoRow,
} from "../styles";

const ContentGroup = styled.div`
  display: flex;
  align-items: center;
`;

const getWorkflowCount = (contentMeta: Dictionary<NodeResourceMeta>) => {
  const contentMetaList = Object.values(contentMeta);
  const workflowCount = contentMetaList.filter((c) => c.status?.current !== PUBLISHED).length;
  return workflowCount;
};

interface Props {
  contentMeta: Dictionary<NodeResourceMeta>;
  currentNode: ResourceWithNodeConnectionAndMeta;
  onCurrentNodeChanged: (changedNode: NodeChild) => void;
  resources: ResourceWithNodeConnectionAndMeta[];
  resourceTypes: Pick<ResourceType, "id" | "name">[];
  articleIds?: number[];
  contentMetaLoading: boolean;
  responsible: string | undefined;
  topicNodes: Node[] | undefined;
  showQuality: boolean;
}

const TopicResourceBanner = ({
  contentMeta,
  currentNode,
  onCurrentNodeChanged,
  resourceTypes,
  resources,
  contentMetaLoading,
  responsible,
  topicNodes,
  showQuality,
}: Props) => {
  const { t } = useTranslation();

  const elementCount = Object.values(contentMeta).length;
  const workflowCount = useMemo(() => getWorkflowCount(contentMeta), [contentMeta]);

  const lastCommentTopicArticle = useMemo(
    () => Object.values(contentMeta).find((el) => el.articleType === "topic-article")?.comments?.[0]?.content,
    [contentMeta],
  );

  const contexts = topicNodes?.filter((node) => !!node.contexts.length);
  return (
    <BannerWrapper>
      <TopInfoRow>
        <FlexContentWrapper>
          <JumpToStructureButton nodeId={currentNode.id} />
          <PlannedResourceModal currentNode={currentNode} resourceTypes={resourceTypes} resources={resources} />
        </FlexContentWrapper>
        <FlexContentWrapper>
          {showQuality && (
            <>
              <AverageQualityEvaluation gradeAverage={currentNode.gradeAverage} nodeType="TOPIC" />
              <QualityEvaluation
                articleType="topic-article"
                taxonomy={[currentNode]}
                iconButtonColor="primary"
                gradeVariant="small"
              />
            </>
          )}
          <Text textStyle="label.small">{`${workflowCount}/${elementCount} ${t(
            "taxonomy.workflow",
          ).toLowerCase()}`}</Text>
          {lastCommentTopicArticle && (
            <Comment
              size="small"
              title={stripInlineContentHtmlTags(lastCommentTopicArticle)}
              aria-label={stripInlineContentHtmlTags(lastCommentTopicArticle)}
            />
          )}
          <ApproachingRevisionDate resources={resources} contentMeta={contentMeta} currentNode={currentNode} />
          {currentNode && currentNode.id && (
            <GroupResourceSwitch
              node={currentNode}
              onChanged={(partialMeta) => {
                onCurrentNodeChanged({
                  ...currentNode,
                  metadata: { ...currentNode.metadata, ...partialMeta },
                });
              }}
            />
          )}
        </FlexContentWrapper>
      </TopInfoRow>
      <CardWrapper>
        <StyledResourceCard>
          <ContentGroup>
            <StyledResourceIcon key="img">
              <ContentTypeBadge
                aria-label={t("searchForm.articleType.topicArticle")}
                background
                type="topic"
                size="x-small"
                title={t("searchForm.articleType.topicArticle")}
              />
            </StyledResourceIcon>
          </ContentGroup>
          <ResourceCardContentWrapper>
            <TitleRow>
              <span>
                <ResourceItemLink
                  contentType={"topic-article"}
                  contentUri={currentNode.contentUri}
                  name={currentNode.name}
                  isVisible={currentNode.metadata?.visible}
                  size="small"
                />
              </span>
              <ContentGroup>
                <StatusIcons
                  contentMetaLoading={contentMetaLoading}
                  resource={currentNode}
                  path={currentNode.path}
                  multipleTaxonomy={contexts?.length ? contexts.length > 1 : false}
                />
                <RelevanceOption resource={currentNode} currentNodeId={currentNode.id} />
              </ContentGroup>
            </TitleRow>
            <ButtonRow>
              <StyledResponsibleBadge>
                <BoldFont>{`${t("form.responsible.label")}: `}</BoldFont>
                {responsible ?? t("form.responsible.noResponsible")}
              </StyledResponsibleBadge>
              <GrepCodesModal
                codes={currentNode.contentMeta?.grepCodes ?? []}
                contentType={"topic-article"}
                contentUri={currentNode.contentUri}
                revision={currentNode.contentMeta?.revision}
                currentNodeId={currentNode.id}
              />
              <VersionHistory resource={currentNode} contentType={"topic-article"} />
            </ButtonRow>
          </ResourceCardContentWrapper>
        </StyledResourceCard>
      </CardWrapper>
    </BannerWrapper>
  );
};

export default TopicResourceBanner;
