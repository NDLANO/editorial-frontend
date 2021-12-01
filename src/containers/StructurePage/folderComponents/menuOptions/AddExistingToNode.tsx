import { useEffect, useState } from 'react';
import { Plus } from '@ndla/icons/action';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import MenuItemDropdown from './components/MenuItemDropdown';
import { fetchConnectionsForNode, fetchNodes } from '../../../../modules/taxonomy/nodes/nodeApi';
import { NodeType } from '../../../../modules/taxonomy/nodes/nodeApiTypes';
import {
  useDeleteNodeConnectionMutation,
  usePostNodeConnectionMutation,
} from '../../../../modules/taxonomy/nodes/nodeMutations';
import { CHILD_NODES_WITH_ARTICLE_TYPE } from '../../../../queryKeys';
import { retrieveBreadCrumbs } from '../../../../util/taxonomyHelpers';
import MenuItemButton from './components/MenuItemButton';
import RoundIcon from '../../../../components/RoundIcon';
import { EditModeHandler } from '../SettingsMenuDropdownType';

interface Props {
  node: NodeType;
  onClose: () => void;
  editModeHandler: EditModeHandler;
  structure: NodeType[];
  rootNodeId: string;
}

const AddExistingToNode = ({ node, structure, editModeHandler, onClose, rootNodeId }: Props) => {
  const { t, i18n } = useTranslation();
  const qc = useQueryClient();
  const { toggleEditMode, editMode } = editModeHandler;
  const path = node.path
    .split('/')
    .join('/urn:')
    .substr(1);

  const [nodes, setNodes] = useState<(NodeType & { description?: string })[]>([]);
  const deleteNodeConnection = useDeleteNodeConnectionMutation();
  const addNodeConnection = usePostNodeConnectionMutation();

  useEffect(() => {
    (async () => {
      const fetchedNodes = await fetchNodes({ language: i18n.language ?? 'nb' });
      const transformedNodes = fetchedNodes
        .filter(node => !node.paths?.find(p => p.includes(path)))
        .map(node => ({ ...node, description: getNodeBreadcrumb(node, fetchedNodes) }));
      setNodes(transformedNodes);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNodeBreadcrumb = (node: NodeType, nodes: NodeType[]) => {
    if (!node.path) return undefined;
    const bc = retrieveBreadCrumbs({
      nodePath: node.path,
      structure: structure,
      allNodes: nodes,
      title: node.name,
    });
    return bc.map(crumb => crumb.name).join(' > ');
  };

  const onAddExistingNode = async (nodeToAdd: NodeType) => {
    const connections = await fetchConnectionsForNode(nodeToAdd.id);
    if (connections && connections.length > 0) {
      const connectionId = connections[0].connectionId;
      await deleteNodeConnection.mutateAsync({ id: connectionId });
    }
    await addNodeConnection.mutateAsync({ body: { parentId: node.id, childId: nodeToAdd.id } });
    qc.invalidateQueries([CHILD_NODES_WITH_ARTICLE_TYPE, rootNodeId]);
  };

  const toggleEditModeFunc = () => toggleEditMode('addExistingToNode');

  if (editMode === 'addExistingToNode') {
    return (
      <MenuItemDropdown
        searchResult={nodes}
        placeholder={t('taxonomy.existingNode')}
        onClose={onClose}
        onSubmit={onAddExistingNode}
        icon={<Plus />}
        showPagination
      />
    );
  }
  return (
    <MenuItemButton stripped data-testid="addExistingNodeButton" onClick={toggleEditModeFunc}>
      <RoundIcon small icon={<Plus />} />
      {t('taxonomy.addExistingNode')}
    </MenuItemButton>
  );
};

export default AddExistingToNode;
