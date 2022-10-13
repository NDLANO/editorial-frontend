/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ToggleItem } from '@ndla/ui/lib/Filter';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  name: string;
}

const CheckboxSelector = ({ name, checked: checkedProp, onChange: onChangeProp }: Props) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(checkedProp);
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeProp(event);
    setChecked(event.currentTarget.checked);
  };

  useEffect(() => {
    if (checked !== checkedProp) {
      setChecked(checkedProp);
    }
  }, [checked, checkedProp]);

  return (
    <ToggleItem
      id={'exclude-revision-log'}
      label={t(`searchForm.types.${name}`)}
      onChange={onChange}
      checked={checked}
    />
  );
};

export default CheckboxSelector;
