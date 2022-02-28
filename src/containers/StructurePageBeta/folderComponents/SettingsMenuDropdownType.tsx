/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { TAXONOMY_ADMIN_SCOPE } from '../../../constants';
import { EditMode } from '../../../interfaces';
import { NodeType, SUBJECT_NODE, TOPIC_NODE } from '../../../modules/nodes/nodeApiTypes';
import { getNodeTypeFromNodeId } from '../../../modules/nodes/nodeUtil';
import { useSession } from '../../Session/SessionProvider';
import ToggleVisibility from './sharedMenuOptions/ToggleVisibility';

interface Props {
  rootNodeId: string;
  node: NodeType;
  onClose: () => void;
  structure: NodeType[];
}

export interface EditModeHandler {
  editMode: EditMode;
  toggleEditMode: (editMode: EditMode) => void;
}

const SettingsMenuDropdownType = ({ rootNodeId, node, onClose, structure }: Props) => {
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
        {/* <ChangeNodeName editModeHandler={editModeHandler} node={node} />
        <EditCustomFields toggleEditMode={toggleEditMode} editMode={editMode} node={node} />
        <AddExistingToNode
          node={node}
          editModeHandler={editModeHandler}
          onClose={onClose}
          structure={structure}
          rootNodeId={rootNodeId}
        /> */}
        <ToggleVisibility node={node} editModeHandler={editModeHandler} rootNodeId={rootNodeId} />
        {/* <EditGrepCodes node={node} editModeHandler={editModeHandler} />
        <EditSubjectpageOption node={node} />
        <DeleteNode node={node} editModeHandler={editModeHandler} /> */}
      </>
    );
  } else if (nodeType === TOPIC_NODE) {
    return (
      <>
        {/* <PublishChildNode node={node} />
        <EditCustomFields toggleEditMode={toggleEditMode} editMode={editMode} node={node} />
        <DeleteChildNode editModeHandler={editModeHandler} node={node} rootNodeId={rootNodeId} />
        <AddExistingToNode
          node={node}
          editModeHandler={editModeHandler}
          onClose={onClose}
          rootNodeId={rootNodeId}
          structure={structure}
        /> */}
        <ToggleVisibility node={node} editModeHandler={editModeHandler} rootNodeId={rootNodeId} />
        {/* <EditGrepCodes node={node} editModeHandler={editModeHandler} />
        <CopyResources toNode={node} structure={structure} onClose={onClose} /> */}
      </>
    );
  } else return null;
};

export default SettingsMenuDropdownType;
