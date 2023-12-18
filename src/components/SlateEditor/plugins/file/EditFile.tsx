/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { FormControl, InputV3, Label } from '@ndla/forms';

const StyledInputV3 = styled(InputV3)`
  min-height: 0;
  background-color: ${colors.white};
  width: 100%;
  // !important is needed to override styles from data-no-border attribute styling
  border: 1px solid ${colors.brand.greyMedium} !important;
  &:focus-within {
    border: 1px solid ${colors.brand.primary} !important;
  }
`;

const StyledFormControl = styled(FormControl)`
  width: 100%;
`;

interface Props {
  onEditFileName: (index: number, value: string) => void;
  index: number;
  title: string;
  setEditFileIndex: (v: number | undefined) => void;
}

const EditFile = ({ onEditFileName, index, title, setEditFileIndex }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledFormControl id={'update-file-name'}>
      <Label visuallyHidden>{t('form.file.changeName')}</Label>
      <StyledInputV3
        name="file-name"
        value={title}
        onChange={(e) => onEditFileName(index, e.target.value)}
        onBlur={() => setEditFileIndex(undefined)}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
    </StyledFormControl>
  );
};

export default EditFile;
