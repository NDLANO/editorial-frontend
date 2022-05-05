/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import config from '../../../config';
import { TAXONOMY_ADMIN_SCOPE } from '../../../constants';
import { EditMode } from '../../../interfaces';
import { NodeType, SUBJECT_NODE, TOPIC_NODE } from '../../../modules/nodes/nodeApiTypes';
import { getNodeTypeFromNodeId } from '../../../modules/nodes/nodeUtil';
import { useSession } from '../../Session/SessionProvider';
import DeleteNode from './sharedMenuOptions/DeleteNode';
import EditCustomFields from './sharedMenuOptions/EditCustomFields';
import EditGrepCodes from './sharedMenuOptions/EditGrepCodes';
import RequestNodePublish from './sharedMenuOptions/RequestNodePublish';
import ToggleVisibility from './sharedMenuOptions/ToggleVisibility';
import ToNodeDiff from './sharedMenuOptions/ToNodeDiff';
import AddExistingToNode from './subjectMenuOptions/AddExistingToNode';
import ChangeNodeName from './subjectMenuOptions/ChangeNodeName';
import EditSubjectpageOption from './subjectMenuOptions/EditSubjectpageOption';

interface Props {
  rootNodeId: string;
  node: NodeType;
  onClose: () => void;
  structure: NodeType[];
  nodeChildren: NodeType[];
  onCurrentNodeChanged: (node: NodeType) => void;
}

export interface EditModeHandler {
  editMode: EditMode;
  toggleEditMode: (editMode: EditMode) => void;
}

const SettingsMenuDropdownType = ({
  rootNodeId,
  node,
  onClose,
  structure,
  onCurrentNodeChanged,
  nodeChildren,
}: Props) => {
  const { userPermissions } = useSession();
  const [editMode, setEditMode] = useState<EditMode>('');
  const nodeType = getNodeTypeFromNodeId(node.id);
  const toggleEditMode = (mode: EditMode) => setEditMode(prev => (mode === prev ? '' : mode));
  const editModeHandler = { editMode, toggleEditMode };

  if (!userPermissions?.includes(TAXONOMY_ADMIN_SCOPE)) {
    return null;
  }

  if (nodeType === SUBJECT_NODE) {
    return (
      <>
        <ChangeNodeName editModeHandler={editModeHandler} node={node} />
        <EditCustomFields
          toggleEditMode={toggleEditMode}
          editMode={editMode}
          node={node}
          onCurrentNodeChanged={onCurrentNodeChanged}
        />
        <AddExistingToNode editModeHandler={editModeHandler} currentNode={node} />
        <ToggleVisibility node={node} editModeHandler={editModeHandler} rootNodeId={rootNodeId} />
        <EditGrepCodes node={node} editModeHandler={editModeHandler} />
        <EditSubjectpageOption node={node} />
        {config.versioningEnabled && (
          <>
            <RequestNodePublish
              node={node}
              editModeHandler={editModeHandler}
              rootNodeId={rootNodeId}
            />
            <ToNodeDiff node={node} />
          </>
        )}
        <DeleteNode
          node={node}
          nodeChildren={nodeChildren}
          editModeHandler={editModeHandler}
          rootNodeId={rootNodeId}
        />
      </>
    );
  } else if (nodeType === TOPIC_NODE) {
    return (
      <>
        {/* <PublishChildNode node={node} /> */}
        <EditCustomFields
          toggleEditMode={toggleEditMode}
          editMode={editMode}
          node={node}
          onCurrentNodeChanged={onCurrentNodeChanged}
        />
        <AddExistingToNode editModeHandler={editModeHandler} currentNode={node} />
        <ToggleVisibility node={node} editModeHandler={editModeHandler} rootNodeId={rootNodeId} />
        <EditGrepCodes node={node} editModeHandler={editModeHandler} />
        {config.versioningEnabled && (
          <>
            <RequestNodePublish
              node={node}
              editModeHandler={editModeHandler}
              rootNodeId={rootNodeId}
            />
            <ToNodeDiff node={node} />
          </>
        )}
        <DeleteNode
          node={node}
          nodeChildren={nodeChildren}
          editModeHandler={editModeHandler}
          rootNodeId={rootNodeId}
        />
        {/* <CopyResources toNode={node} structure={structure} onClose={onClose} /> */}
      </>
    );
  } else return null;
};

export default SettingsMenuDropdownType;
