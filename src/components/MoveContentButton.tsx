/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IconButtonV2 } from '@ndla/button';
import { ChevronLeft } from '@ndla/icons/common';
import Tooltip from '@ndla/tooltip';
import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  onMouseDown?: MouseEventHandler;
}

const MoveContentButton = ({ onMouseDown }: Props) => {
  const { t } = useTranslation();
  return (
    <Tooltip tooltip={t('learningResourceForm.fields.rightAside.moveContent')}>
      <IconButtonV2
        contentEditable={false}
        tabIndex={-1}
        aria-label={t('learningResourceForm.fields.rightAside.moveContent')}
        variant="ghost"
        onMouseDown={onMouseDown}
      >
        <ChevronLeft />
      </IconButtonV2>
    </Tooltip>
  );
};

export default MoveContentButton;
