/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '@ndla/tooltip';
import styled from '@emotion/styled';
import ToggleSwitch from '../../../../components/ToggleSwitch';
import { RESOURCE_FILTER_CORE, RESOURCE_FILTER_SUPPLEMENTARY } from '../../../../constants';

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
        <ToggleSwitch
          onClick={() => {
            onChange(isOn ? RESOURCE_FILTER_SUPPLEMENTARY : RESOURCE_FILTER_CORE);
            setIsOn(!isOn);
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

export default RelevanceOption;
