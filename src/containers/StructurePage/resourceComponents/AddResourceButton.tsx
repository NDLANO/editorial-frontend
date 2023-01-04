/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import { IconButton } from '@ndla/button';
import { useTranslation } from 'react-i18next';

interface Props {
  onClick: () => void;
  children: ReactNode;
}

const AddResourceButton = ({ children, ...rest }: Props) => {
  const { t } = useTranslation();

  return (
    <IconButton size="xsmall" stripped aria-label={t('taxonomy.addResource')} {...rest}>
      {children}
    </IconButton>
  );
};

export default AddResourceButton;
