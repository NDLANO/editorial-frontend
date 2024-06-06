/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2, IconButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { Plus } from "@ndla/icons/action";
import { Modal, ModalContent, ModalTrigger } from "@ndla/modal";
import { Tabs } from "@ndla/tabs";
import { NodeChild, ResourceType } from "@ndla/types-taxonomy";
import { Text } from "@ndla/typography";
import ApproachingRevisionDate from "./ApproachingRevisionDate";
import GroupResourceSwitch from "./GroupResourcesSwitch";
import QualityEvaluationInfo from "./QualityEvaluationInfo";
import { ResourceWithNodeConnectionAndMeta } from "./StructureResources";
import TaxonomyLightbox from "../../../components/Taxonomy/TaxonomyLightbox";
import config from "../../../config";
import { PUBLISHED } from "../../../constants";
import { Dictionary } from "../../../interfaces";
import { NodeResourceMeta } from "../../../modules/nodes/nodeQueries";
import CommentIndicator from "../../WelcomePage/components/worklist/CommentIndicator";
import AddExistingResource from "../plannedResource/AddExistingResource";
import AddResourceModal from "../plannedResource/AddResourceModal";
import PlannedResourceForm from "../plannedResource/PlannedResourceForm";
import { ResourceGroupBanner, StyledShareIcon } from "../styles";

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
`;

const getWorkflowCount = (contentMeta: Dictionary<NodeResourceMeta>) => {
  const contentMetaList = Object.values(contentMeta);
  const workflowCount = contentMetaList.filter((c) => c.status?.current !== PUBLISHED).length;
  return workflowCount;
};

interface Props {
  title: string;
  contentMeta: Dictionary<NodeResourceMeta>;
  currentNode: NodeChild;
  onCurrentNodeChanged: (changedNode: NodeChild) => void;
  resources: ResourceWithNodeConnectionAndMeta[];
  resourceTypes: Pick<ResourceType, "id" | "name">[];
  articleIds?: number[];
}

const ResourceBanner = ({ title, contentMeta, currentNode, onCurrentNodeChanged, resourceTypes, resources }: Props) => {
  const [open, setOpen] = useState(false);
  const elementCount = Object.values(contentMeta).length;
  const workflowCount = useMemo(() => getWorkflowCount(contentMeta), [contentMeta]);
  const { t } = useTranslation();
  const allRevisions = useMemo(() => {
    const resourceRevisions = resources.map((r) => r.contentMeta?.revisions).filter((r) => !!r);
    const currentNodeRevision = currentNode.contentUri ? contentMeta[currentNode.contentUri]?.revisions : undefined;
    return resourceRevisions.concat([currentNodeRevision]);
  }, [contentMeta, currentNode.contentUri, resources]);
  const lastCommentTopicArticle = useMemo(
    () => Object.values(contentMeta).find((el) => el.articleType === "topic-article")?.comments?.[0]?.content,
    [contentMeta],
  );
  const close = useCallback(() => setOpen(false), []);

  return (
    <ResourceGroupBanner>
      <BannerWrapper>
        <RightContent>
          <ButtonV2
            size="small"
            variant="outline"
            onClick={() => document.getElementById(currentNode.id)?.scrollIntoView({ block: "center" })}
          >
            {t("taxonomy.jumpToStructure")}
          </ButtonV2>
          <ControlWrapper>
            {config.qualityEvaluationEnabled === true && <QualityEvaluationInfo contentMeta={contentMeta} />}
            <Text margin="none" textStyle="meta-text-small">{`${workflowCount}/${elementCount} ${t(
              "taxonomy.workflow",
            ).toLowerCase()}`}</Text>
            {lastCommentTopicArticle && <CommentIndicator comment={lastCommentTopicArticle} />}
            <ApproachingRevisionDate revisions={allRevisions} />
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

        <Content>
          <StyledShareIcon />
          {title}
          <Modal open={open} onOpenChange={setOpen} modal={false}>
            <ModalTrigger>
              <IconButtonV2
                size="xsmall"
                variant="ghost"
                aria-label={t("taxonomy.addResource")}
                title={t("taxonomy.addResource")}
              >
                <Plus />
              </IconButtonV2>
            </ModalTrigger>
            <ModalContent size={{ width: "normal", height: "large" }} position="top" forceOverlay>
              <TaxonomyLightbox title={t("taxonomy.addResource")}>
                <AddResourceModal>
                  <Tabs
                    tabs={[
                      {
                        title: t("taxonomy.createResource"),
                        id: "create-new-resource",
                        content: <PlannedResourceForm onClose={close} articleType="standard" node={currentNode} />,
                      },
                      {
                        title: t("taxonomy.getExisting"),
                        id: "get-existing-resource",
                        content: (
                          <AddExistingResource
                            resourceTypes={resourceTypes}
                            nodeId={currentNode.id}
                            onClose={close}
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
      </BannerWrapper>
    </ResourceGroupBanner>
  );
};

export default ResourceBanner;
