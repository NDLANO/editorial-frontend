/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { css } from '@emotion/core';
import Button from '@ndla/button';
import Tooltip from '@ndla/tooltip';
import { RemoveCircle } from '@ndla/icons/action';
import { spacing } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { classes } from '../containers/StructurePage/resourceComponents/ResourceGroup';

const deleteButtonStyle = css`
  margin-left: ${spacing.small};
  line-height: 1;
`;

interface Props {
  onClick: () => void;
}

const RemoveButton = ({ onClick }: Props) => {
  const { t } = useTranslation();
  return (
    <Tooltip tooltip={t('taxonomy.removeResource')}>
      <Button css={deleteButtonStyle} onClick={onClick} stripped>
        <RemoveCircle {...classes('deleteIcon')} />
      </Button>
    </Tooltip>
  );
};

export default RemoveButton;
