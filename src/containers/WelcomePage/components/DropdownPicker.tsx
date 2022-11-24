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
  valueList: FilterElement[];
  stateValue: FilterElement | undefined;
  updateValue: (updateValue: FilterElement) => void;
}

const DropdownPicker = ({ placeholder, valueList, stateValue, updateValue }: Props) => {
  return (
    <StyledSelect
      onChange={e =>
        updateValue({
          id: e.target.value,
          name: valueList.find(value => value.id === e.target.value)?.name ?? '',
        })
      }
      value={stateValue?.id}>
      <option value="">{placeholder}</option>
      {valueList.map(value => (
        <option value={value.id}>{value.name}</option>
      ))}
    </StyledSelect>
  );
};

export default DropdownPicker;
