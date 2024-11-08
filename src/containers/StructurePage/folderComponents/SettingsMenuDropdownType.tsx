/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { Node } from "@ndla/types-taxonomy";
import ConnectExistingNode from "./sharedMenuOptions/ConnectExistingNode";
import CopyRevisionDate from "./sharedMenuOptions/CopyRevisionDate";
import DeleteNode from "./sharedMenuOptions/DeleteNode";
import DisconnectFromParent from "./sharedMenuOptions/DisconnectFromParent";
import EditCustomFields from "./sharedMenuOptions/EditCustomFields";
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
import { TAXONOMY_ADMIN_SCOPE } from "../../../constants";
import { EditMode } from "../../../interfaces";
import { PROGRAMME, SUBJECT_NODE, TOPIC_NODE } from "../../../modules/nodes/nodeApiTypes";
import { getNodeTypeFromNodeId } from "../../../modules/nodes/nodeUtil";
import { useSession } from "../../Session/SessionProvider";

interface Props {
  rootNodeId: string;
  node: Node;
  nodeChildren: Node[];
  onCurrentNodeChanged: (node?: Node) => void;
}

export interface EditModeHandler {
  editMode: EditMode;
  toggleEditMode: (editMode: EditMode) => void;
}

const SettingsMenuDropdownType = ({ rootNodeId, node, onCurrentNodeChanged, nodeChildren }: Props) => {
  const { userPermissions } = useSession();
  const [editMode, setEditMode] = useState<EditMode>("");
  const nodeType = getNodeTypeFromNodeId(node.id);
  const toggleEditMode = (mode: EditMode) => setEditMode((prev) => (mode === prev ? "" : mode));
  const editModeHandler = { editMode, toggleEditMode };

  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);

  if (nodeType === PROGRAMME) {
    return (
      <>
        {isTaxonomyAdmin && <ChangeNodeName editModeHandler={editModeHandler} node={node} />}
        {isTaxonomyAdmin && (
          <EditCustomFields
            toggleEditMode={toggleEditMode}
            editMode={editMode}
            node={node}
            onCurrentNodeChanged={onCurrentNodeChanged}
          />
        )}
        <MoveExistingNode editModeHandler={editModeHandler} currentNode={node} nodeType="PROGRAMME" />
        <ConnectExistingNode editModeHandler={editModeHandler} currentNode={node} nodeType="SUBJECT" />
        <ToggleVisibility
          node={node}
          editModeHandler={editModeHandler}
          rootNodeId={rootNodeId}
          rootNodeType="PROGRAMME"
        />
        {isTaxonomyAdmin && <EditSubjectpageOption node={node} />}
        <ToNodeDiff node={node} />
        {isTaxonomyAdmin && (
          <DeleteNode
            node={node}
            nodeChildren={nodeChildren}
            editModeHandler={editModeHandler}
            rootNodeId={rootNodeId}
            onCurrentNodeChanged={onCurrentNodeChanged}
          />
        )}
      </>
    );
  }
  if (nodeType === SUBJECT_NODE) {
    if (rootNodeId !== node.id) {
      return (
        <>
          {isTaxonomyAdmin && (
            <DisconnectFromParent
              node={node}
              editModeHandler={editModeHandler}
              onCurrentNodeChanged={onCurrentNodeChanged}
            />
          )}
        </>
      );
    }
    return (
      <>
        {isTaxonomyAdmin && <ChangeNodeName editModeHandler={editModeHandler} node={node} />}
        {isTaxonomyAdmin && (
          <EditCustomFields
            toggleEditMode={toggleEditMode}
            editMode={editMode}
            node={node}
            onCurrentNodeChanged={onCurrentNodeChanged}
          />
        )}
        <MoveExistingNode editModeHandler={editModeHandler} currentNode={node} />
        <ToggleVisibility node={node} editModeHandler={editModeHandler} rootNodeId={rootNodeId} />
        {isTaxonomyAdmin && <EditGrepCodes node={node} editModeHandler={editModeHandler} />}
        {isTaxonomyAdmin && <EditSubjectpageOption node={node} />}
        <ToNodeDiff node={node} />
        {isTaxonomyAdmin && (
          <DeleteNode
            node={node}
            nodeChildren={nodeChildren}
            editModeHandler={editModeHandler}
            rootNodeId={rootNodeId}
            onCurrentNodeChanged={onCurrentNodeChanged}
          />
        )}
      </>
    );
  }
  if (nodeType === TOPIC_NODE) {
    return (
      <>
        {isTaxonomyAdmin && <PublishChildNodeResources node={node} />}
        {isTaxonomyAdmin && <SwapTopicArticle node={node} editModeHandler={editModeHandler} rootNodeId={rootNodeId} />}
        {isTaxonomyAdmin && (
          <EditCustomFields
            toggleEditMode={toggleEditMode}
            editMode={editMode}
            node={node}
            onCurrentNodeChanged={onCurrentNodeChanged}
          />
        )}
        <MoveExistingNode editModeHandler={editModeHandler} currentNode={node} />
        <ToggleVisibility node={node} editModeHandler={editModeHandler} rootNodeId={rootNodeId} />
        <ToNodeDiff node={node} />
        {false && <CopyRevisionDate node={node} editModeHandler={editModeHandler} />}
        {isTaxonomyAdmin && (
          <DeleteNode
            node={node}
            nodeChildren={nodeChildren}
            editModeHandler={editModeHandler}
            rootNodeId={rootNodeId}
            onCurrentNodeChanged={onCurrentNodeChanged}
          />
        )}
        <CopyNodeResources
          currentNode={node}
          editModeHandler={editModeHandler}
          type="copyResources"
          rootNodeId={rootNodeId}
        />
        {isTaxonomyAdmin && (
          <CopyNodeResources
            currentNode={node}
            editModeHandler={editModeHandler}
            type="cloneResources"
            rootNodeId={rootNodeId}
          />
        )}
        {isTaxonomyAdmin && <SetResourcesPrimary node={node} editModeHandler={editModeHandler} recursive />}
      </>
    );
  }
  return null;
};

export default SettingsMenuDropdownType;
