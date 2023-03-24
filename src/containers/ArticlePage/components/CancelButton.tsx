/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useTranslation } from 'react-i18next';
import { StyledButton } from './Comment';

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

const CancelButton = ({ onClick, disabled = false }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledButton
      shape="pill"
      size="xsmall"
      colorTheme="danger"
      flex={1}
      disabled={disabled}
      onClick={onClick}
    >
      {t('form.abort')}
    </StyledButton>
  );
};

export default CancelButton;
