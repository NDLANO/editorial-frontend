/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import styled from '@emotion/styled';
import { fonts } from '@ndla/core';
import { FilterElement } from './WorkList';

const StyledSelect = styled.select`
  height: 35px;
  width: 150px;
  ${fonts.sizes(16, 1.1)};
`;

interface Props {
  placeholder: string;
  options: FilterElement[];
  value: FilterElement | undefined;
  onChange: (updateValue: FilterElement) => void;
}

const DropdownPicker = ({ placeholder, options, value, onChange }: Props) => {
  return (
    <StyledSelect
      onChange={e =>
        onChange({
          id: e.target.value,
          name: options.find(option => option.id === e.target.value)?.name ?? '',
        })
      }
      value={value?.id}>
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option value={option.id} key={option.id}>
          {option.name}
        </option>
      ))}
    </StyledSelect>
  );
};

export default DropdownPicker;
