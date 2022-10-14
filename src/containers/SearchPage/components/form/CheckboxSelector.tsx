/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ToggleItem } from '@ndla/ui/lib/Filter';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  name: string;
}

const CheckboxSelector = ({ name, checked, onChange }: Props) => {
  const { t } = useTranslation();

  return (
    <ToggleItem
      id={`checkbox-${name}`}
      label={t(`searchForm.types.${name}`)}
      onChange={onChange}
      checked={checked}
    />
  );
};

export default CheckboxSelector;
