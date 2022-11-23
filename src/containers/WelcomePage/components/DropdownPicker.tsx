/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import styled from '@emotion/styled';
import { fonts } from '@ndla/core';

const StyledSelect = styled.select`
  height: 35px;
  max-width: 150px;
  ${fonts.sizes(16, 1.1)};
`;

interface Props {
  placeholder: string;
  valueList: string[];
  stateValue: any;
  updateValue: (updateValue: string) => void;
}

const DropdownPicker = ({ placeholder, valueList, stateValue, updateValue }: Props) => {
  return (
    <StyledSelect onChange={e => updateValue(e.target.value)} value={stateValue}>
      <option value="">{placeholder}</option>
      {valueList.map(value => (
        <option value={value}>{value}</option>
      ))}
    </StyledSelect>
  );
};

export default DropdownPicker;
