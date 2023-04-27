/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQueryClient } from '@tanstack/react-query';
import styled from '@emotion/styled';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';
import {
  useDeleteNodeConnectionMutation,
  usePostNodeConnectionMutation,
} from '../../../modules/nodes/nodeMutations';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import { childNodesWithArticleTypeQueryKey } from '../../../modules/nodes/nodeQueries';
import { NodeType } from '../../../modules/nodes/nodeApiTypes';
import NodeSearchDropdown from '../folderComponents/sharedMenuOptions/components/NodeSearchDropdown';
import { fonts } from '@ndla/core';
import { css } from '@emotion/react';
import { StyledErrorMessage } from '../folderComponents/styles';
import { fetchConnectionsForNode } from '../../../modules/nodes/nodeApi';

const visibleOverflowStyles = css`
  overflow: visible;
`;

const StyledModal = styled(TaxonomyLightbox)`
  overflow: visible;
`;

const Wrapper = styled.div`
  width: 100%;
`;
const StyledLabel = styled.label`
  font-weight: ${fonts.weight.semibold};
  ${fonts.sizes('16px')}
`;

export const ErrorMessage = styled(StyledErrorMessage)`
  width: fit-content;
`;

interface Props {
  onClose: () => void;
  setShowPlannedTopicModal: (show: boolean) => void;
  currentNode?: NodeType;
}

const AddTopicModal = ({ onClose, setShowPlannedTopicModal, currentNode }: Props) => {
  const { t, i18n } = useTranslation();
  const [node, setNode] = useState<NodeType | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const { taxonomyVersion } = useTaxonomyVersion();
  const qc = useQueryClient();

  const { mutateAsync: addNodeConnectionMutation, isLoading } = usePostNodeConnectionMutation();
  const deleteNodeConnectionMutation = useDeleteNodeConnectionMutation();

  const onSubmit = async () => {
    if (!currentNode || !node) return;

    setError(undefined);

    try {
      console.log(currentNode, node);
      const connections = await fetchConnectionsForNode({ id: node.id, taxonomyVersion });
      const parentConnection = connections.find((conn) => conn.type === 'parent-topic');

      if (!parentConnection) {
        throw new Error();
      }
      await deleteNodeConnectionMutation.mutateAsync({
        taxonomyVersion,
        id: parentConnection.connectionId,
      });
      await addNodeConnectionMutation({
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
  return (
    <StyledModal
      title={t('taxonomy.addExistingTopic')}
      onClose={onClose}
      actions={[
        {
          text: t('taxonomy.createTopic'),
          onClick: () => {
            onClose();
            setShowPlannedTopicModal(true);
          },
        },
        {
          text: t('form.save'),
          onClick: () => onSubmit(),
          loading: isLoading,
        },
      ]}
      cssStyles={visibleOverflowStyles}
    >
      <Wrapper>
        {currentNode && (
          <>
            <StyledLabel htmlFor="add-topic-input">{t('taxonomy.searchExistingTopic')}</StyledLabel>
            <NodeSearchDropdown
              id="add-topic-input"
              placeholder={t('form.relatedContent.placeholder')}
              onChange={(node) => setNode(node)}
              searchNodeType={'TOPIC'}
              filter={(node) => {
                return (
                  !!node.path &&
                  !node.paths?.some((p) => {
                    const split = p.replace('/', '').split('/');
                    return split[split.length - 2] === currentNode.id.replace('urn:', '');
                  })
                );
              }}
            />
          </>
        )}
        {error && <ErrorMessage>{t(error)}</ErrorMessage>}
      </Wrapper>
    </StyledModal>
  );
};

export default AddTopicModal;
