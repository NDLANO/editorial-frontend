/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { RemoveCircle } from '@ndla/icons/action';
import Tooltip from '@ndla/tooltip';

const StyledRemoveButton = styled(ButtonV2)`
  margin-left: ${spacing.small};
`;

const StyledRemoveCircle = styled(RemoveCircle)`
  width: 24px;
  height: 24px;
  opacity: 0.6;
`;

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

const RemoveButton = ({ onClick, disabled }: Props) => {
  const { t } = useTranslation();
  return (
    <Tooltip tooltip={t('taxonomy.removeResource')}>
      <StyledRemoveButton onClick={onClick} variant="stripped" disabled={disabled}>
        <StyledRemoveCircle />
      </StyledRemoveButton>
    </Tooltip>
  );
};

export default RemoveButton;
