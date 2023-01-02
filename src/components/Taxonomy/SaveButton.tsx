/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ButtonV2 as Button } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import Spinner from '../Spinner';

interface Props {
  handleClick: () => void;
  disabled?: boolean;
  loading: boolean;
}

const SaveButton = ({ handleClick, disabled, loading }: Props) => {
  const { t } = useTranslation();

  return (
    <Button data-testid="taxonomyLightboxButton" onClick={handleClick} disabled={disabled}>
      {loading ? <Spinner appearance="small" /> : t('form.save')}
    </Button>
  );
};

export default SaveButton;
