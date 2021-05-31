/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import {
  TAXONOMY_CUSTOM_FIELD_GROUPED_RESOURCE,
  TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES,
  TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE,
} from '../../../constants';
import { StyledMenuItemEditField, StyledMenuItemInputField } from './styles';
import RoundIcon from '../../../components/RoundIcon';
import ToggleSwitch from '../../../components/ToggleSwitch';
import { TaxonomyMetadata } from '../../../interfaces';
import { updateTopicMetadata } from '../../../modules/taxonomy/topics';

interface Props {
  id: string;
  metadata: TaxonomyMetadata;
  refreshTopics: () => void;
  hideIcon?: boolean;
}

const GroupTopicResources = ({ id, metadata, refreshTopics, hideIcon, t }: Props & tType) => {
  const updateMetadata = () => {
    const customFields = {
      ...metadata.customFields,
      [TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES]: isGrouped
        ? TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE
        : TAXONOMY_CUSTOM_FIELD_GROUPED_RESOURCE,
    };
    updateTopicMetadata(id, { customFields });
    setTimeout(() => refreshTopics(), 500);
  };

  // eslint-disable-next-line react/prop-types
  const topicResources = metadata.customFields[TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES];
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
      <ToggleSwitch on={isGrouped} offLabel={'U'} onLabel={'G'} onClick={() => updateMetadata()} />
    </StyledMenuItemEditField>
  );
};

export default injectT(GroupTopicResources);
