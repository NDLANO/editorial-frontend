/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { injectT, tType } from '@ndla/i18n';
import Tooltip from '@ndla/tooltip';
import styled from '@emotion/styled';
import ToggleSwitch from '../../../../components/ToggleSwitch';
import { RESOURCE_FILTER_CORE, RESOURCE_FILTER_SUPPLEMENTARY } from '../../../../constants';
import {
  updateTopicResource,
  updateTopicSubtopic,
  updateSubjectTopic,
} from '../../../../modules/taxonomy';

interface Props {
  relevanceId: string | null | undefined;
  isPrimary: boolean;
  connectionId: string;
  rank: number;
}

interface Body {
  relevanceId: string;
  primary: boolean;
  rank: number;
}

const updateRelevanceId = (connectionId: string, body: Body) => {
  const [, connectionType] = connectionId.split(':');
  switch (connectionType) {
    case 'topic-resource':
      updateTopicResource(connectionId, body);
      break;
    case 'topic-subtopic':
      updateTopicSubtopic(connectionId, body);
      break;
    case 'subject-topic':
      updateSubjectTopic(connectionId, body);
      break;
    default:
      return;
  }
};

const RelevanceOption = ({ relevanceId, isPrimary, connectionId, rank, t }: Props & tType) => {
  const [isOn, setIsOn] = useState((relevanceId ?? RESOURCE_FILTER_CORE) === RESOURCE_FILTER_CORE);

  return (
    <Tooltip tooltip={t('form.topics.RGTooltip')}>
      <StyledToggleSwitch>
        <ToggleSwitch
          onClick={() => {
            setIsOn(!isOn);
            return updateRelevanceId(connectionId, {
              relevanceId: isOn ? RESOURCE_FILTER_SUPPLEMENTARY : RESOURCE_FILTER_CORE,
              primary: isPrimary,
              rank: rank,
            });
          }}
          on={isOn}
          testId="toggleRelevanceId"
        />
      </StyledToggleSwitch>
    </Tooltip>
  );
};

const StyledToggleSwitch = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
`;

export default injectT(RelevanceOption);
