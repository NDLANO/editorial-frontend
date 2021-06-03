/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import Tooltip from '@ndla/tooltip';
import styled from '@emotion/styled';
import ToggleSwitch from '../../../../components/ToggleSwitch';
import { RESOURCE_FILTER_CORE, RESOURCE_FILTER_SUPPLEMENTARY } from '../../../../constants';

interface Props {
  relevanceId: string | null | undefined;
  isPrimary: boolean;
  connectionId: string;
  onChange: (connectionId: string, body: Body) => void;
  refreshResources: () => void;
  rank: number;
}

interface Body {
  relevanceId: string;
  primary: boolean;
  rank: number;
}

const RelevanceOption = ({
  relevanceId,
  isPrimary,
  connectionId,
  onChange,
  refreshResources,
  rank,
  t,
}: Props & tType) => {
  const relevance: boolean = (relevanceId ?? RESOURCE_FILTER_CORE) === RESOURCE_FILTER_CORE;

  return (
    <StyledToggleSwitch>
      <Tooltip tooltip={t('form.filter.tooltip')}>
        <ToggleSwitch
          onClick={() => {
            setTimeout(() => refreshResources(), 200);
            return onChange(connectionId, {
              relevanceId: relevance ? RESOURCE_FILTER_SUPPLEMENTARY : RESOURCE_FILTER_CORE,
              primary: isPrimary,
              rank: rank,
            });
          }}
          on={relevance}
          testId="toggleRelevanceId"
        />
      </Tooltip>
    </StyledToggleSwitch>
  );
};

const StyledToggleSwitch = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
`;

export default injectT(RelevanceOption);
