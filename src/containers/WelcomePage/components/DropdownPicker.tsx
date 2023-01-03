/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import styled from '@emotion/styled';
import { fonts } from '@ndla/core';
import { Option, Select } from '@ndla/select';

const StyledSelect = styled.select`
  height: 35px;
  width: 150px;
  ${fonts.sizes(16, 1.1)};
`;

interface Props {
  placeholder: string;
  options: Option[];
  value: Option[] | undefined;
  onChange: (v: readonly Option[]) => void;
}

const DropdownPicker = ({ placeholder, options, value, onChange }: Props) => {
  return (
    <Select<true>
      options={options}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      menuPlacement="bottom"
      isMultiSelect
      small
      outline
      //isLoading={isLoading}
    />
  );
};

export default DropdownPicker;
