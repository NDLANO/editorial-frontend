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
import AddExistingToNode from './sharedMenuOptions/AddExistingToNode';
import ChangeNodeName from './subjectMenuOptions/ChangeNodeName';
import EditSubjectpageOption from './subjectMenuOptions/EditSubjectpageOption';
import PublishChildNodeResources from './topicMenuOptions/PublishChildNodeResources';
import CopyNodeResources from './topicMenuOptions/CopyNodeResources';
import CopyRevisionDate from './sharedMenuOptions/CopyRevisionDate';
import SwapTopicArticle from './topicMenuOptions/SwapTopicArticle';
import SetResourcesPrimary from './topicMenuOptions/SetResourcesPrimary';

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
  } else if (nodeType === SUBJECT_NODE) {
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
        <AddExistingToNode editModeHandler={editModeHandler} currentNode={node} />
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
  } else if (nodeType === TOPIC_NODE) {
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
        <AddExistingToNode editModeHandler={editModeHandler} currentNode={node} />
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
  } else return null;
};

export default SettingsMenuDropdownType;
