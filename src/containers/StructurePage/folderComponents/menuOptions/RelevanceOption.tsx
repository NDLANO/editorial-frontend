/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
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
}: Props) => {
  const relevance: boolean = (relevanceId ?? RESOURCE_FILTER_CORE) === RESOURCE_FILTER_CORE;

  return (
    <StyledToggleSwitch>
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
    </StyledToggleSwitch>
  );
};

const StyledToggleSwitch = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
`;

export default RelevanceOption;
