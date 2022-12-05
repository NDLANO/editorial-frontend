/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import Button from '@ndla/button';
import Tooltip from '@ndla/tooltip';
import { RemoveCircle } from '@ndla/icons/action';
import { spacing } from '@ndla/core';
import { useTranslation } from 'react-i18next';

const StyledRemoveButton = styled(Button)`
  margin-left: ${spacing.small};
  line-height: 1;
`;

const StyledRemoveCircle = styled(RemoveCircle)`
  width: 24px;
  height: 24px;
  opacity: 0.6;
`;

interface Props {
  onClick: () => void;
}

const RemoveButton = ({ onClick }: Props) => {
  const { t } = useTranslation();
  return (
    <Tooltip tooltip={t('taxonomy.removeResource')}>
      <StyledRemoveButton onClick={onClick} stripped>
        <StyledRemoveCircle />
      </StyledRemoveButton>
    </Tooltip>
  );
};

export default RemoveButton;
