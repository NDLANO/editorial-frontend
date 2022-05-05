/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { Plus } from '@ndla/icons/action';
import RoundIcon from '../../../../components/RoundIcon';
import { EditModeHandler } from '../SettingsMenuDropdownType';
import MenuItemButton from '../sharedMenuOptions/components/MenuItemButton';
import NodeSearchDropdown from './NodeSearchDropdown';
import { NodeType } from '../../../../modules/nodes/nodeApiTypes';
import { fetchConnectionsForNode } from '../../../../modules/nodes/nodeApi';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';
import {
  useDeleteNodeConnectionMutation,
  usePostNodeConnectionMutation,
} from '../../../../modules/nodes/nodeMutations';
import { childNodesWithArticleTypeQueryKey } from '../../../../modules/nodes/nodeQueries';
import { StyledErrorMessage } from '../styles';

interface Props {
  editModeHandler: EditModeHandler;
  currentNode: NodeType;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: calc(${spacing.small} / 2);
`;
const AddExistingToNode = ({
  editModeHandler: { editMode, toggleEditMode },
  currentNode,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const deleteNodeConnectionMutation = useDeleteNodeConnectionMutation();
  const addNodeConnectionMutation = usePostNodeConnectionMutation();
  const [error, setError] = useState<string | undefined>(undefined);
  const qc = useQueryClient();

  const handleSubmit = async (node: NodeType) => {
    setError(undefined);
    try {
      const connections = await fetchConnectionsForNode({ id: node.id, taxonomyVersion });
      const parentConnection = connections.find(conn => conn.type === 'parent-topic');
      if (!parentConnection) {
        setError('taxonomy.errorMessage');
        return;
      }
      await deleteNodeConnectionMutation.mutateAsync({
        taxonomyVersion,
        id: parentConnection.connectionId,
      });
      await addNodeConnectionMutation.mutateAsync({
        taxonomyVersion,
        body: { parentId: currentNode.id, childId: node.id },
      });

      // Invalidate all childNode-queries, since we don't know where the added node is from
      qc.invalidateQueries(
        childNodesWithArticleTypeQueryKey({
          taxonomyVersion,
          language: i18n.language,
        }),
      );
    } catch (e) {
      setError('taxonomy.errorMessage');
    }
  };

  if (editMode === 'addExistingTopic') {
    return (
      <Wrapper>
        <RoundIcon open small smallIcon icon={<Plus />} />
        <NodeSearchDropdown
          placeholder="Eksisterende emne"
          onChange={handleSubmit}
          searchNodeType={'TOPIC'}
          filter={node => {
            return (
              !!node.path &&
              !node.paths?.some(p => {
                const split = p.replace('/', '').split('/');
                return split[split.length - 2] === currentNode.id.replace('urn:', '');
              })
            );
          }}
        />
        {error && (
          <StyledErrorMessage data-testid="inlineEditErrorMessage">{t(error)}</StyledErrorMessage>
        )}
      </Wrapper>
    );
  }

  const toggleEditModeFunc = () => toggleEditMode('addExistingTopic');
  return (
    <MenuItemButton stripped onClick={toggleEditModeFunc}>
      <RoundIcon small icon={<Plus />} />
      {t('taxonomy.addExistingTopic')}
    </MenuItemButton>
  );
};

export default AddExistingToNode;
