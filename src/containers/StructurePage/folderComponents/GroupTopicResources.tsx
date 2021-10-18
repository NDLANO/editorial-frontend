/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
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
import { useTopicMetadataUpdateMutation } from '../../../modules/taxonomy/topics/topicQueries';
import { SUBJECT_TOPICS } from '../../../queryKeys';

interface Props {
  topicId: string;
  subjectId: string;
  metadata: TaxonomyMetadata;
  hideIcon?: boolean;
  onChanged?: (newMeta: Partial<TaxonomyMetadata>) => void;
}

const GroupTopicResources = ({ topicId, subjectId, metadata, hideIcon, onChanged }: Props) => {
  const { t } = useTranslation();
  const updateTopicMetadataMutation = useTopicMetadataUpdateMutation();
  const qc = useQueryClient();
  const updateMetadata = async () => {
    const customFields = {
      ...metadata.customFields,
      [TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES]: isGrouped
        ? TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE
        : TAXONOMY_CUSTOM_FIELD_GROUPED_RESOURCE,
    };
    updateTopicMetadataMutation.mutate(
      { id: topicId, metadata: { customFields } },
      {
        onSettled: () => qc.invalidateQueries(SUBJECT_TOPICS),
        onSuccess: () => onChanged?.({ customFields }),
      },
    );
  };

  const topicResources = metadata?.customFields[TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES];
  const isGrouped =
    (topicResources ?? TAXONOMY_CUSTOM_FIELD_GROUPED_RESOURCE) ===
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

export default GroupTopicResources;
