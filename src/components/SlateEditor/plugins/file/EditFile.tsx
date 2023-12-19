/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// eslint-disable-next-line lodash/import-scope
import { DebouncedFunc } from 'lodash';
import debounce from 'lodash/debounce';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { FormControl, InputV3, Label } from '@ndla/forms';
import { File } from '../../../../interfaces';

const StyledInputV3 = styled(InputV3)`
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
  index: number;
  title: string;
  files: File[];
  onEditFileList: (data: File[]) => void;
  setEditFileIndex: (i: number | undefined) => void;
}

const EditFile = ({ index, title, files, onEditFileList, setEditFileIndex }: Props) => {
  const [fileName, setFileName] = useState(title);
  const { t } = useTranslation();
  const debounceFunc = useRef<DebouncedFunc<() => void> | null>(null);

  const onEditFileName = (index: number, value: string) => {
    debounceFunc.current?.cancel?.();
    const data = files.map((file, i) => (i === index ? { ...file, title: value } : file));
    setFileName(value);
    debounceFunc.current = debounce(() => onEditFileList(data), 500);
    debounceFunc.current?.();
  };

  return (
    <StyledFormControl id={'update-file-name'}>
      <Label visuallyHidden>{t('form.file.changeName')}</Label>
      <StyledInputV3
        name="file-name"
        value={fileName}
        onChange={(e) => onEditFileName(index, e.target.value)}
        onBlur={() => setEditFileIndex(undefined)}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
    </StyledFormControl>
  );
};

export default EditFile;
