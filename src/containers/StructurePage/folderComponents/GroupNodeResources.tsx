/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { css } from '@emotion/core';
import Tooltip from '@ndla/tooltip';
import {
  TAXONOMY_CUSTOM_FIELD_GROUPED_RESOURCE,
  TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES,
  TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE,
} from '../../../constants';
import { StyledMenuItemEditField, StyledMenuItemInputField } from './styles';
import RoundIcon from '../../../components/RoundIcon';
import ToggleSwitch from '../../../components/ToggleSwitch';
import { TaxonomyMetadata } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { CHILD_NODES_WITH_ARTICLE_TYPE } from '../../../queryKeys';
import { NodeType } from '../../../modules/taxonomy/nodes/nodeApiTypes';
import { useUpdateNodeMetadataMutation } from '../../../modules/taxonomy/nodes/nodeMutations';

interface Props {
  node: NodeType;
  hideIcon?: boolean;
  onChanged?: (newMeta: Partial<TaxonomyMetadata>) => void;
}

const GroupNodeResources = ({ node, hideIcon, onChanged }: Props) => {
  const { t } = useTranslation();
  const updateNodeMetadata = useUpdateNodeMetadataMutation();
  const qc = useQueryClient();
  const updateMetadata = async () => {
    const customFields = {
      ...node.metadata.customFields,
      [TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES]: isGrouped
        ? TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE
        : TAXONOMY_CUSTOM_FIELD_GROUPED_RESOURCE,
    };
    updateNodeMetadata.mutate(
      { id: node.id, metadata: { customFields } },
      {
        onSettled: () => qc.invalidateQueries(CHILD_NODES_WITH_ARTICLE_TYPE),
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
      <Tooltip
        tooltip={t('taxonomy.metadata.customFields.RGTooltip')}
        css={css`
          display: flex;
        `}>
        <ToggleSwitch
          on={isGrouped}
          labelOff={'U'}
          labelOn={'G'}
          onClick={() => updateMetadata()}
        />
      </Tooltip>
    </StyledMenuItemEditField>
  );
};

export default GroupNodeResources;
