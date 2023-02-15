/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { useMemo } from 'react';
import { Switch } from '@ndla/switch';
import Tooltip from '@ndla/tooltip';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import {
  TAXONOMY_CUSTOM_FIELD_GROUPED_RESOURCE,
  TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES,
  TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE,
} from '../../../constants';
import { NodeType } from '../../../modules/nodes/nodeApiTypes';
import { useUpdateNodeMetadataMutation } from '../../../modules/nodes/nodeMutations';
import { childNodesWithArticleTypeQueryKey } from '../../../modules/nodes/nodeQueries';
import { getRootIdForNode, isRootNode } from '../../../modules/nodes/nodeUtil';
import { TaxonomyMetadata } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';

const StyledSwitch = styled(Switch)`
  margin-left: -${spacing.small};
`;

interface Props {
  node: NodeType;
  onChanged: (newMeta: Partial<TaxonomyMetadata>) => void;
}

const isGrouped = (node: NodeType): boolean => {
  const nodeResources = node.metadata?.customFields[TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES];
  const isGrouped =
    (nodeResources ?? TAXONOMY_CUSTOM_FIELD_GROUPED_RESOURCE) ===
    TAXONOMY_CUSTOM_FIELD_GROUPED_RESOURCE;
  return isGrouped;
};

const GroupResourceSwitch = ({ node, onChanged }: Props) => {
  const grouped = useMemo(() => isGrouped(node), [node]);
  const { t, i18n } = useTranslation();

  const updateNodeMetadata = useUpdateNodeMetadataMutation();
  const rootNodeId = getRootIdForNode(node);
  const { taxonomyVersion } = useTaxonomyVersion();
  const qc = useQueryClient();

  const compKey = childNodesWithArticleTypeQueryKey({
    taxonomyVersion,
    id: rootNodeId,
    language: i18n.language,
  });

  const updateMetadata = async () => {
    const customFields = {
      ...node.metadata.customFields,
      [TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES]: grouped
        ? TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE
        : TAXONOMY_CUSTOM_FIELD_GROUPED_RESOURCE,
    };
    updateNodeMetadata.mutate(
      {
        id: node.id,
        metadata: { customFields },
        rootId: isRootNode(node) ? undefined : rootNodeId,
        taxonomyVersion,
      },
      {
        onSettled: () => qc.invalidateQueries(compKey),
        onSuccess: () => onChanged({ customFields }),
      },
    );
  };

  return (
    <Tooltip tooltip={t('taxonomy.metadata.customFields.RGTooltip')}>
      <div>
        <StyledSwitch
          id="group-resources"
          checked={grouped}
          label=""
          onChange={updateMetadata}
          thumbCharacter={grouped ? 'G' : 'U'}
        />
      </div>
    </Tooltip>
  );
};

export default GroupResourceSwitch;
