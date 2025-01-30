/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node, NodeChild } from "@ndla/types-taxonomy";
import AddProgramme from "./programmeMenuOptions/AddProgramme";
import AddTopicNode from "./sharedMenuOptions/AddTopicNode";
import MenuItemCustomField from "./sharedMenuOptions/components/MenuItemCustomField";
import ConnectExistingNode from "./sharedMenuOptions/ConnectExistingNode";
import DeleteNode from "./sharedMenuOptions/DeleteNode";
import DisconnectFromParent from "./sharedMenuOptions/DisconnectFromParent";
import EditGrepCodes from "./sharedMenuOptions/EditGrepCodes";
import MoveExistingNode from "./sharedMenuOptions/MoveExistingNode";
import ToggleVisibility from "./sharedMenuOptions/ToggleVisibility";
import ToNodeDiff from "./sharedMenuOptions/ToNodeDiff";
import ChangeNodeName from "./subjectMenuOptions/ChangeNodeName";
import EditSubjectpageOption from "./subjectMenuOptions/EditSubjectpageOption";
import CopyNodeResources from "./topicMenuOptions/CopyNodeResources";
import PublishChildNodeResources from "./topicMenuOptions/PublishChildNodeResources";
import SetResourcesPrimary from "./topicMenuOptions/SetResourcesPrimary";
import SwapTopicArticle from "./topicMenuOptions/SwapTopicArticle";
import RelevanceOption from "../../../components/Taxonomy/RelevanceOption";
import { TaxonomyNodeChild } from "../../../components/Taxonomy/types";
import { TAXONOMY_ADMIN_SCOPE } from "../../../constants";
import { PROGRAMME, SUBJECT_NODE, TOPIC_NODE } from "../../../modules/nodes/nodeApiTypes";
import { NodeChildWithChildren } from "../../../modules/nodes/nodeQueries";
import { getNodeTypeFromNodeId } from "../../../modules/nodes/nodeUtil";
import { useSession } from "../../Session/SessionProvider";

const StyledTabsContent = styled(TabsContent, {
  base: {
    width: "100%",
  },
});

const StyledTabsList = styled(TabsList, {
  base: {
    maxWidth: "surface.xxsmall",
    "& > button": {
      whiteSpace: "unset",
      textAlign: "start",
    },
  },
});

interface Props {
  rootNodeId: string;
  node: TaxonomyNodeChild | Node;
  nodeChildren: NodeChildWithChildren[];
  onCurrentNodeChanged: (node?: Node | NodeChild) => void;
}

const SettingsMenuDropdownType = ({ rootNodeId, node, onCurrentNodeChanged, nodeChildren }: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const nodeType = getNodeTypeFromNodeId(node.id);

  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);

  if (nodeType === PROGRAMME) {
    return (
      <>
        <TabsRoot orientation="vertical" variant="line" translations={{ listLabel: t("taxonomy.nodeSettings") }}>
          <StyledTabsList>
            {!!isTaxonomyAdmin && (
              <TabsTrigger value="changeSubjectName">{t("taxonomy.changeName.buttonTitle")}</TabsTrigger>
            )}
            {!!isTaxonomyAdmin && (
              <TabsTrigger value="editCustomFields">{t("taxonomy.metadata.customFields.alterFields")}</TabsTrigger>
            )}
            <TabsTrigger value="moveExistingNode">
              {t("taxonomy.addExistingNode", {
                nodeType: t(`taxonomy.nodeType.${nodeType}`),
              })}
            </TabsTrigger>
            <TabsTrigger value="connectExistingNode">
              {t("taxonomy.connectExistingNode", {
                nodeType: t("taxonomy.nodeType.SUBJECT"),
              })}
            </TabsTrigger>
            <TabsTrigger value="toggleMetadataVisibility">{t("metadata.changeVisibility")}</TabsTrigger>
            <TabsTrigger value="addProgramme">
              {t("taxonomy.addNode", {
                nodeType: t(`taxonomy.nodeType.${nodeType}`),
              })}
            </TabsTrigger>
            {!!isTaxonomyAdmin && (
              <TabsTrigger value="deleteProgramme">
                {t("taxonomy.delete.deleteNode", {
                  nodeType: t(`taxonomy.nodeType.${nodeType}`),
                })}
              </TabsTrigger>
            )}
            <TabsIndicator />
          </StyledTabsList>
          {!!isTaxonomyAdmin && (
            <StyledTabsContent value="changeSubjectName">
              <ChangeNodeName node={node} />
            </StyledTabsContent>
          )}
          {!!isTaxonomyAdmin && (
            <StyledTabsContent value="editCustomFields">
              <MenuItemCustomField node={node} onCurrentNodeChanged={onCurrentNodeChanged} />
            </StyledTabsContent>
          )}
          <StyledTabsContent value="moveExistingNode">
            <MoveExistingNode currentNode={node} nodeType={nodeType} />
          </StyledTabsContent>
          <StyledTabsContent value="connectExistingNode">
            <ConnectExistingNode currentNode={node} nodeType="SUBJECT" />
          </StyledTabsContent>
          <StyledTabsContent value="toggleMetadataVisibility">
            <ToggleVisibility node={node} rootNodeId={rootNodeId} rootNodeType="PROGRAMME" />
          </StyledTabsContent>
          <StyledTabsContent value="addProgramme">
            <AddProgramme node={node} rootNodeId={rootNodeId} />
          </StyledTabsContent>
          {!!isTaxonomyAdmin && (
            <StyledTabsContent value="deleteProgramme">
              <DeleteNode
                node={node}
                nodeType={nodeType}
                nodeChildren={nodeChildren}
                rootNodeId={rootNodeId}
                onCurrentNodeChanged={onCurrentNodeChanged}
              />
            </StyledTabsContent>
          )}
        </TabsRoot>
        {!!isTaxonomyAdmin && <EditSubjectpageOption node={node} />}
        <ToNodeDiff node={node} />
      </>
    );
  }
  if (nodeType === SUBJECT_NODE) {
    if (rootNodeId !== node.id) {
      return (
        <TabsRoot orientation="vertical" variant="line" translations={{ listLabel: t("taxonomy.nodeSettings") }}>
          <StyledTabsList>
            {!!isTaxonomyAdmin && (
              <TabsTrigger value="disconnectFromParent">{t("taxonomy.disconnectNode")}</TabsTrigger>
            )}
            <TabsIndicator />
          </StyledTabsList>
          {!!isTaxonomyAdmin && (
            <StyledTabsContent value="disconnectFromParent">
              <DisconnectFromParent node={node} onCurrentNodeChanged={onCurrentNodeChanged} />
            </StyledTabsContent>
          )}
        </TabsRoot>
      );
    }
    return (
      <>
        <TabsRoot orientation="vertical" variant="line" translations={{ listLabel: t("taxonomy.nodeSettings") }}>
          <StyledTabsList>
            {!!isTaxonomyAdmin && (
              <TabsTrigger value="changeSubjectName" data-testid="changeNodeNameButton">
                {t("taxonomy.changeName.buttonTitle")}
              </TabsTrigger>
            )}
            {!!isTaxonomyAdmin && (
              <TabsTrigger value="editCustomFields">{t("taxonomy.metadata.customFields.alterFields")}</TabsTrigger>
            )}
            <TabsTrigger value="moveExistingNode">
              {t("taxonomy.addExistingNode", {
                nodeType: t(`taxonomy.nodeType.TOPIC`),
              })}
            </TabsTrigger>
            <TabsTrigger value="toggleMetadataVisibility" data-testid="toggleVisibilityButton">
              {t("metadata.changeVisibility")}
            </TabsTrigger>
            {!!isTaxonomyAdmin && <TabsTrigger value="editGrepCodes">{t("taxonomy.grepCodes.edit")}</TabsTrigger>}
            <TabsTrigger value="addTopic">{t("taxonomy.addTopic")}</TabsTrigger>
            {!!isTaxonomyAdmin && (
              <TabsTrigger value="deleteSubject">
                {t("taxonomy.delete.deleteNode", {
                  nodeType: t(`taxonomy.nodeType.${nodeType}`),
                })}
              </TabsTrigger>
            )}
            <TabsIndicator />
          </StyledTabsList>
          {!!isTaxonomyAdmin && (
            <StyledTabsContent value="changeSubjectName">
              <ChangeNodeName node={node} />
            </StyledTabsContent>
          )}
          {!!isTaxonomyAdmin && (
            <StyledTabsContent value="editCustomFields">
              <MenuItemCustomField node={node} onCurrentNodeChanged={onCurrentNodeChanged} />
            </StyledTabsContent>
          )}
          <StyledTabsContent value="moveExistingNode">
            <MoveExistingNode currentNode={node} />
          </StyledTabsContent>
          <StyledTabsContent value="toggleMetadataVisibility">
            <ToggleVisibility node={node} rootNodeId={rootNodeId} />
          </StyledTabsContent>
          {!!isTaxonomyAdmin && (
            <StyledTabsContent value="editGrepCodes">
              <EditGrepCodes node={node} />
            </StyledTabsContent>
          )}
          <StyledTabsContent value="addTopic">
            <AddTopicNode node={node} />
          </StyledTabsContent>
          {!!isTaxonomyAdmin && (
            <StyledTabsContent value="deleteSubject">
              <DeleteNode
                node={node}
                nodeType={nodeType}
                nodeChildren={nodeChildren}
                rootNodeId={rootNodeId}
                onCurrentNodeChanged={onCurrentNodeChanged}
              />
            </StyledTabsContent>
          )}
        </TabsRoot>
        {!!isTaxonomyAdmin && <EditSubjectpageOption node={node} />}
        <ToNodeDiff node={node} />
      </>
    );
  }
  if (nodeType === TOPIC_NODE) {
    return (
      <>
        <TabsRoot orientation="vertical" variant="line" translations={{ listLabel: t("taxonomy.nodeSettings") }}>
          <StyledTabsList>
            {!!isTaxonomyAdmin && <TabsTrigger value="requestPublish">{t("taxonomy.publish.button")}</TabsTrigger>}
            {!!isTaxonomyAdmin && (
              <TabsTrigger value="swapTopicArticle">{t("taxonomy.swapTopicArticle.info")}</TabsTrigger>
            )}
            {!!isTaxonomyAdmin && (
              <TabsTrigger value="editCustomFields">{t("taxonomy.metadata.customFields.alterFields")}</TabsTrigger>
            )}
            <TabsTrigger value="moveExistingNode">
              {t("taxonomy.addExistingNode", {
                nodeType: t(`taxonomy.nodeType.${nodeType}`),
              })}
            </TabsTrigger>
            <TabsTrigger value="toggleMetadataVisibility">{t("metadata.changeVisibility")}</TabsTrigger>
            <TabsTrigger value="toggleRelevance">{t("taxonomy.resourceType.tabTitle")}</TabsTrigger>
            <TabsTrigger value="copyResources">{t("taxonomy.copyResources.info")}</TabsTrigger>
            {!!isTaxonomyAdmin && <TabsTrigger value="cloneResources">{t("taxonomy.cloneResources.info")}</TabsTrigger>}
            {!!isTaxonomyAdmin && (
              <TabsTrigger value="setResourcesPrimary">
                {t("taxonomy.resourcesPrimary.recursiveButtonText")}
              </TabsTrigger>
            )}
            <TabsTrigger value="addTopic">{t("taxonomy.addTopic")}</TabsTrigger>
            {!!isTaxonomyAdmin && (
              <TabsTrigger value="deleteTopic">
                {t("taxonomy.delete.deleteNode", {
                  nodeType: t(`taxonomy.nodeType.${nodeType}`),
                })}
              </TabsTrigger>
            )}
            <TabsIndicator />
          </StyledTabsList>
          {!!isTaxonomyAdmin && (
            <StyledTabsContent value="requestPublish">
              <PublishChildNodeResources node={node} />
            </StyledTabsContent>
          )}
          {!!isTaxonomyAdmin && (
            <StyledTabsContent value="swapTopicArticle">
              <SwapTopicArticle node={node} rootNodeId={rootNodeId} />
            </StyledTabsContent>
          )}
          {!!isTaxonomyAdmin && (
            <StyledTabsContent value="editCustomFields">
              <MenuItemCustomField node={node} onCurrentNodeChanged={onCurrentNodeChanged} />
            </StyledTabsContent>
          )}
          <StyledTabsContent value="moveExistingNode">
            <MoveExistingNode currentNode={node} />
          </StyledTabsContent>
          <StyledTabsContent value="toggleMetadataVisibility">
            <ToggleVisibility node={node} rootNodeId={rootNodeId} />
          </StyledTabsContent>
          <StyledTabsContent value="toggleRelevance">
            <RelevanceOption node={node as NodeChild} currentNodeId={rootNodeId} />
          </StyledTabsContent>
          <StyledTabsContent value="copyResources">
            <CopyNodeResources currentNode={node} nodeType={TOPIC_NODE} type="copyResources" />
          </StyledTabsContent>
          {!!isTaxonomyAdmin && (
            <StyledTabsContent value="cloneResources">
              <CopyNodeResources currentNode={node} nodeType={TOPIC_NODE} type="cloneResources" />
            </StyledTabsContent>
          )}
          {!!isTaxonomyAdmin && (
            <StyledTabsContent value="setResourcesPrimary">
              <SetResourcesPrimary node={node} recursive />
            </StyledTabsContent>
          )}
          <StyledTabsContent value="addTopic">
            <AddTopicNode node={node} />
          </StyledTabsContent>
          {!!isTaxonomyAdmin && (
            <StyledTabsContent value="deleteTopic">
              <DeleteNode
                node={node}
                nodeType={nodeType}
                nodeChildren={nodeChildren}
                rootNodeId={rootNodeId}
                onCurrentNodeChanged={onCurrentNodeChanged}
              />
            </StyledTabsContent>
          )}
        </TabsRoot>
        <ToNodeDiff node={node} />
      </>
    );
  }
  return null;
};

export default SettingsMenuDropdownType;
