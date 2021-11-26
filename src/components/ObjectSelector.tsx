/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, MouseEvent } from 'react';
import { uuid } from '@ndla/util';

interface Props {
  options: Record<string, any>[];
  value: string;
  onChange: (event: FormEvent<HTMLSelectElement>) => void;
  onBlur?: (event: FormEvent<HTMLSelectElement>) => void;
  labelKey: string;
  idKey: string;
  disabled?: boolean;
  className?: string;
  emptyField?: boolean;
  placeholder?: string;
  name: string;
  onClick?: (event: MouseEvent<HTMLSelectElement>) => void;
}
const ObjectSelector = ({
  options,
  labelKey,
  idKey,
  disabled = false,
  onChange,
  onBlur,
  value,
  emptyField = false,
  placeholder = '',
  className = '',
  name,
  onClick,
}: Props) => {
  return (
    <select
      onBlur={onBlur}
      onChange={onChange}
      value={value}
      disabled={disabled}
      name={name}
      className={className}
      onClick={onClick}>
      {emptyField ? <option value="">{placeholder}</option> : ''}
      {options.map(option => (
        <option key={option[idKey] ? option[idKey] : uuid()} value={option[idKey]}>
          {option[labelKey]}
        </option>
      ))}
    </select>
  );
};

export default ObjectSelector;
