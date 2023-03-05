/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import Tooltip from '@ndla/tooltip';
import styled from '@emotion/styled';
import { Switch } from '@ndla/switch';
import {
  TAXONOMY_CUSTOM_FIELD_GROUPED_RESOURCE,
  TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES,
  TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE,
} from '../../../../constants';
import RoundIcon from '../../../../components/RoundIcon';
import { StyledMenuItemEditField, StyledMenuItemInputField } from '../styles';
import { TaxonomyMetadata } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { NodeType } from '../../../../modules/nodes/nodeApiTypes';
import { useUpdateNodeMetadataMutation } from '../../../../modules/nodes/nodeMutations';
import { getRootIdForNode, isRootNode } from '../../../../modules/nodes/nodeUtil';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';
import { childNodesWithArticleTypeQueryKey } from '../../../../modules/nodes/nodeQueries';

interface Props {
  node: NodeType;
  hideIcon?: boolean;
  onChanged?: (newMeta: Partial<TaxonomyMetadata>) => void;
}

const StyledTooltip = styled(Tooltip)`
  display: flex;
`;

const GroupTopicResources = ({ node, hideIcon, onChanged }: Props) => {
  const { t, i18n } = useTranslation();
  const updateNodeMetadata = useUpdateNodeMetadataMutation();
  const qc = useQueryClient();
  const rootNodeId = getRootIdForNode(node);
  const { taxonomyVersion } = useTaxonomyVersion();
  const compKey = childNodesWithArticleTypeQueryKey({
    taxonomyVersion,
    id: rootNodeId,
    language: i18n.language,
  });
  const updateMetadata = async () => {
    const customFields = {
      ...node.metadata.customFields,
      [TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES]: isGrouped
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
        onSuccess: () => onChanged?.({ customFields }),
      },
    );
  };

  const nodeResources = node.metadata?.customFields[TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES];
  const isGrouped =
    (nodeResources ?? TAXONOMY_CUSTOM_FIELD_GROUPED_RESOURCE) ===
    TAXONOMY_CUSTOM_FIELD_GROUPED_RESOURCE;
  return (
    <StyledMenuItemEditField>
      {hideIcon || <RoundIcon open small />}
      <StyledMenuItemInputField
        placeholder={t('taxonomy.metadata.customFields.resourceGroupPlaceholder')}
        disabled
      />
      <StyledTooltip tooltip={t('taxonomy.metadata.customFields.RGTooltip')}>
        <div>
          <Switch
            id="group-topic-resources"
            checked={isGrouped}
            label=""
            onChange={updateMetadata}
            thumbCharacter={isGrouped ? 'G' : 'U'}
          />
        </div>
      </StyledTooltip>
    </StyledMenuItemEditField>
  );
};

export default GroupTopicResources;
