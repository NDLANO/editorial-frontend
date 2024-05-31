/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing, mq, breakpoints } from "@ndla/core";
import { Modal, ModalContent, ModalTrigger } from "@ndla/modal";
import { Tabs } from "@ndla/tabs";
import { NodeChild, ResourceType } from "@ndla/types-taxonomy";
import { Text } from "@ndla/typography";
import { ContentTypeBadge } from "@ndla/ui";
import ApproachingRevisionDate from "./ApproachingRevisionDate";
import GrepCodesModal from "./GrepCodesModal";
import GroupResourceSwitch from "./GroupResourcesSwitch";
import QualityEvaluationInfo from "./QualityEvaluationInfo";
import {
  BadgeWrapper,
  BoldFont,
  ButtonRow,
  ContentWrapper,
  StyledCard,
  StyledResourceIcon,
  StyledResponsibleBadge,
  Wrapper,
} from "./Resource";
import ResourceItemLink from "./ResourceItemLink";
import StatusIcons from "./StatusIcons";
import { ResourceWithNodeConnectionAndMeta } from "./StructureResources";
import VersionHistory from "./VersionHistory";
import RelevanceOption from "../../../components/Taxonomy/RelevanceOption";
import TaxonomyLightbox from "../../../components/Taxonomy/TaxonomyLightbox";
import { PUBLISHED } from "../../../constants";
import { Dictionary } from "../../../interfaces";
import { NodeResourceMeta } from "../../../modules/nodes/nodeQueries";
import CommentIndicator from "../../WelcomePage/components/worklist/CommentIndicator";
import AddExistingResource from "../plannedResource/AddExistingResource";
import AddResourceModal from "../plannedResource/AddResourceModal";
import PlannedResourceForm from "../plannedResource/PlannedResourceForm";
import { StyledPlusIcon } from "../StructureBanner";
import { ResourceGroupBanner } from "../styles";

const BannerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  gap: ${spacing.xsmall};
`;

const ControlWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xxsmall};
`;
const RightContent = styled(Content)`
  gap: ${spacing.small};
  justify-content: space-between;
  flex-wrap: wrap;
`;

const JumpToStructureButton = styled(ButtonV2)`
  ${mq.range({ from: breakpoints.desktop })} {
    display: none;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

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
}

const ResourceBanner = ({
  contentMeta,
  currentNode,
  onCurrentNodeChanged,
  resourceTypes,
  resources,
  contentMetaLoading,
  responsible,
}: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const elementCount = Object.values(contentMeta).length;
  const workflowCount = useMemo(() => getWorkflowCount(contentMeta), [contentMeta]);

  const lastCommentTopicArticle = useMemo(
    () => Object.values(contentMeta).find((el) => el.articleType === "topic-article")?.comments?.[0]?.content,
    [contentMeta],
  );

  return (
    <ResourceGroupBanner>
      <BannerWrapper>
        <RightContent>
          <Content>
            <JumpToStructureButton
              size="small"
              variant="outline"
              onClick={() => document.getElementById(currentNode.id)?.scrollIntoView({ block: "center" })}
            >
              {t("taxonomy.jumpToStructure")}
            </JumpToStructureButton>
            <Modal open={open} onOpenChange={setOpen} modal={false}>
              <ModalTrigger>
                <ButtonV2 size="small">
                  <StyledPlusIcon />
                  {t("taxonomy.newResource")}
                </ButtonV2>
              </ModalTrigger>
              <ModalContent size={{ width: "normal", height: "large" }} position="top" forceOverlay>
                <TaxonomyLightbox title={t("taxonomy.addResource")}>
                  <AddResourceModal>
                    <Tabs
                      tabs={[
                        {
                          title: t("taxonomy.createResource"),
                          id: "create-new-resource",
                          content: (
                            <PlannedResourceForm
                              onClose={() => setOpen(false)}
                              articleType="standard"
                              node={currentNode}
                            />
                          ),
                        },
                        {
                          title: t("taxonomy.getExisting"),
                          id: "get-existing-resource",
                          content: (
                            <AddExistingResource
                              resourceTypes={resourceTypes}
                              nodeId={currentNode.id}
                              onClose={() => setOpen(false)}
                              existingResourceIds={resources.map((r) => r.id)}
                            />
                          ),
                        },
                      ]}
                    />
                  </AddResourceModal>
                </TaxonomyLightbox>
              </ModalContent>
            </Modal>
          </Content>
          <ControlWrapper>
            <QualityEvaluationInfo contentMeta={contentMeta} />
            <Text margin="none" textStyle="meta-text-small">{`${workflowCount}/${elementCount} ${t(
              "taxonomy.workflow",
            ).toLowerCase()}`}</Text>
            {lastCommentTopicArticle && <CommentIndicator comment={lastCommentTopicArticle} />}
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
          </ControlWrapper>
        </RightContent>
        <Wrapper>
          <StyledCard>
            <BadgeWrapper>
              <StyledResourceIcon key="img">
                <ContentTypeBadge
                  aria-label={t("searchForm.articleType.topicArticle")}
                  background
                  type="topic"
                  size="x-small"
                  title={t("searchForm.articleType.topicArticle")}
                />
              </StyledResourceIcon>
            </BadgeWrapper>
            <ContentWrapper>
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
                  <StatusIcons contentMetaLoading={contentMetaLoading} resource={currentNode} path={currentNode.path} />
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
            </ContentWrapper>
          </StyledCard>
        </Wrapper>
      </BannerWrapper>
    </ResourceGroupBanner>
  );
};

export default ResourceBanner;
