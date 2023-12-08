/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { Switch } from '@ndla/switch';
import Tooltip from '@ndla/tooltip';
import { RESOURCE_FILTER_CORE, RESOURCE_FILTER_SUPPLEMENTARY } from '../../constants';

export const StyledSwitch = styled(Switch)`
  margin-left: -${spacing.nsmall};
`;

export const StyledToggleSwitch = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
`;

interface Props {
  relevanceId: string | null | undefined;
  onChange: (id: string) => void;
}

const RelevanceOption = ({ relevanceId, onChange }: Props) => {
  const { t } = useTranslation();
  const [isOn, setIsOn] = useState((relevanceId ?? RESOURCE_FILTER_CORE) === RESOURCE_FILTER_CORE);

  return (
    <Tooltip tooltip={t('form.topics.RGTooltip')}>
      <StyledToggleSwitch>
        <StyledSwitch
          id="toggleRelevanceId"
          test-id="toggleRelevanceId"
          checked={isOn}
          label=""
          onChange={() => {
            onChange(isOn ? RESOURCE_FILTER_SUPPLEMENTARY : RESOURCE_FILTER_CORE);
            setIsOn(!isOn);
          }}
          thumbCharacter={isOn ? 'K' : 'T'}
        />
      </StyledToggleSwitch>
    </Tooltip>
  );
};

export default RelevanceOption;
