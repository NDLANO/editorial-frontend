/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
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
import { updateTopicMetadata } from '../../../modules/taxonomy/topics';

interface Props {
  topicId: string;
  subjectId: string;
  metadata: TaxonomyMetadata;
  updateLocalTopics: (topicId: string, saveItems: { metadata: TaxonomyMetadata }) => void;
  hideIcon?: boolean;
}

const GroupTopicResources = ({
  topicId,
  subjectId,
  metadata,
  updateLocalTopics,
  hideIcon,
}: Props) => {
  const { t } = useTranslation();
  const updateMetadata = async () => {
    const customFields = {
      ...metadata.customFields,
      [TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES]: isGrouped
        ? TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE
        : TAXONOMY_CUSTOM_FIELD_GROUPED_RESOURCE,
    };
    const response = await updateTopicMetadata(topicId, { customFields });
    updateLocalTopics(topicId, {
      metadata: { ...metadata, customFields: response.customFields },
    });
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
