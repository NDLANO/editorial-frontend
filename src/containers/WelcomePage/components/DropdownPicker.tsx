/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import styled from '@emotion/styled';
import { fonts } from '@ndla/core';

interface Props {
  placeholder: string;
  valueList: string[];
}

const StyledSelect = styled.select`
  height: 35px;
  ${fonts.sizes(16, 1.1)};
`;

const DropdownPicker = ({ placeholder, valueList }: Props) => {
  return (
    <StyledSelect>
      <option value="">{placeholder}</option>
      {valueList.map(value => (
        <option value={value}>{value}</option>
      ))}
    </StyledSelect>
  );
};

export default DropdownPicker;
