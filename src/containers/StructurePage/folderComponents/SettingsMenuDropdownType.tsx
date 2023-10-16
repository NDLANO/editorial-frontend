/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { Node } from '@ndla/types-taxonomy';
import { TAXONOMY_ADMIN_SCOPE } from '../../../constants';
import { EditMode } from '../../../interfaces';
import { PROGRAMME, SUBJECT_NODE, TOPIC_NODE } from '../../../modules/nodes/nodeApiTypes';
import { getNodeTypeFromNodeId } from '../../../modules/nodes/nodeUtil';
import { useSession } from '../../Session/SessionProvider';
import DeleteNode from './sharedMenuOptions/DeleteNode';
import EditCustomFields from './sharedMenuOptions/EditCustomFields';
import EditGrepCodes from './sharedMenuOptions/EditGrepCodes';
import RequestNodePublish from './sharedMenuOptions/RequestNodePublish';
import ToggleVisibility from './sharedMenuOptions/ToggleVisibility';
import ToNodeDiff from './sharedMenuOptions/ToNodeDiff';
import ConnectExistingNode from './sharedMenuOptions/ConnectExistingNode';
import MoveExistingNode from './sharedMenuOptions/MoveExistingNode';
import ChangeNodeName from './subjectMenuOptions/ChangeNodeName';
import EditSubjectpageOption from './subjectMenuOptions/EditSubjectpageOption';
import PublishChildNodeResources from './topicMenuOptions/PublishChildNodeResources';
import CopyNodeResources from './topicMenuOptions/CopyNodeResources';
import CopyRevisionDate from './sharedMenuOptions/CopyRevisionDate';
import SwapTopicArticle from './topicMenuOptions/SwapTopicArticle';
import SetResourcesPrimary from './topicMenuOptions/SetResourcesPrimary';
import DisconnectFromParent from './sharedMenuOptions/DisconnectFromParent';

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

const SettingsMenuDropdownType = ({
  rootNodeId,
  node,
  onCurrentNodeChanged,
  nodeChildren,
}: Props) => {
  const { userPermissions } = useSession();
  const [editMode, setEditMode] = useState<EditMode>('');
  const nodeType = getNodeTypeFromNodeId(node.id);
  const toggleEditMode = (mode: EditMode) => setEditMode((prev) => (mode === prev ? '' : mode));
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
        <MoveExistingNode
          editModeHandler={editModeHandler}
          currentNode={node}
          nodeType="PROGRAMME"
        />
        <ConnectExistingNode
          editModeHandler={editModeHandler}
          currentNode={node}
          nodeType="SUBJECT"
        />
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
        <RequestNodePublish node={node} editModeHandler={editModeHandler} rootNodeId={rootNodeId} />
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
        {isTaxonomyAdmin && (
          <SwapTopicArticle node={node} editModeHandler={editModeHandler} rootNodeId={rootNodeId} />
        )}
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
        <RequestNodePublish node={node} editModeHandler={editModeHandler} rootNodeId={rootNodeId} />
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
        />
        {isTaxonomyAdmin && (
          <CopyNodeResources
            currentNode={node}
            editModeHandler={editModeHandler}
            type="cloneResources"
          />
        )}
        {isTaxonomyAdmin && (
          <SetResourcesPrimary node={node} editModeHandler={editModeHandler} recursive />
        )}
      </>
    );
  }
  return null;
};

export default SettingsMenuDropdownType;
