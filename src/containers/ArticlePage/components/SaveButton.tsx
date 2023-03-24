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
  text?: string;
  disabled?: boolean;
  flex?: number;
}

const SaveButton = ({ onClick, text, disabled = false, flex = 1 }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledButton
      variant="outline"
      shape="pill"
      size="xsmall"
      flex={flex}
      disabled={disabled}
      onClick={onClick}
    >
      {text ? text : t('form.save')}
    </StyledButton>
  );
};

export default SaveButton;
