/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';
import { Spinner } from '@ndla/editor';
import { Plus } from '@ndla/icons/action';
import { Done } from '@ndla/icons/editor';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';
import {
  useDeleteNodeConnectionMutation,
  usePostNodeConnectionMutation,
} from '../../../../modules/nodes/nodeMutations';
import { NodeType } from '../../../../modules/nodes/nodeApiTypes';
import { fetchConnectionsForNode } from '../../../../modules/nodes/nodeApi';
import { childNodesWithArticleTypeQueryKey } from '../../../../modules/nodes/nodeQueries';
import RoundIcon from '../../../../components/RoundIcon';
import MenuItemButton from './components/MenuItemButton';
import NodeSearchDropdown from './components/NodeSearchDropdown';
import { EditModeHandler } from '../SettingsMenuDropdownType';

interface Props {
  editModeHandler: EditModeHandler;
  currentNode: NodeType;
}

const StyledSuccessIcon = styled(Done)`
  border-radius: 90px;
  margin: 5px;
  background-color: green;
  color: white;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: calc(${spacing.small} / 2);
`;

const MenuContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
`;

const StyledErrorMessage = styled.div`
  color: ${colors.support.red};
`;

const StyledActionContent = styled.div`
  padding-left: ${spacing.normal};
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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    if (success && editMode === 'addExistingTopic') {
      setSuccess(false);
    }
  }, [editMode, success]);

  const toggleEditModeFunc = () => toggleEditMode('addExistingTopic');

  const handleSubmit = async (node: NodeType) => {
    setLoading(true);
    setError(undefined);
    toggleEditModeFunc();
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
      setSuccess(true);
    } catch (e) {
      setError('taxonomy.errorMessage');
    } finally {
      setLoading(false);
    }
  };

  if (editMode === 'addExistingTopic') {
    return (
      <Wrapper>
        <RoundIcon open small smallIcon icon={<Plus />} />
        <NodeSearchDropdown
          placeholder={t('taxonomy.existingTopic')}
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
      </Wrapper>
    );
  }

  return (
    <StyledMenuWrapper>
      <MenuItemButton stripped onClick={toggleEditModeFunc}>
        <RoundIcon small icon={<Plus />} />
        {t('taxonomy.addExistingTopic')}
      </MenuItemButton>
      <StyledActionContent>
        {loading && (
          <MenuContent>
            <Spinner size="normal" margin="0px 4px" />
            {t('taxonomy.addExistingLoading')}
          </MenuContent>
        )}
        {success && (
          <MenuContent>
            <StyledSuccessIcon />
            {t('taxonomy.addExistingSuccess')}
          </MenuContent>
        )}
        {error && (
          <StyledErrorMessage data-testid="inlineEditErrorMessage">{t(error)}</StyledErrorMessage>
        )}
      </StyledActionContent>
    </StyledMenuWrapper>
  );
};

export default AddExistingToNode;
