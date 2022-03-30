/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import DateTimeInput from '../../../components/DateTime/DateTimeInput';

type ChangeObject = {
  target: {
    name: string;
    value: string;
    type: string;
  };
};

interface Props {
  name: string;
  onChange: (changeObject: ChangeObject) => void;
  value?: string;
  placeholder?: string;
}

const StyledDTI = styled(DateTimeInput)`
  height: 100%;
  border-radius: 3px;
  border-color: ${colors.brand.greyLighter};
  padding-left: 1rem;
`;

const InlineDatePicker = ({ onChange, value, name, placeholder }: Props) => {
  const { i18n } = useTranslation();
  return (
    <StyledDTI
      placeholder={placeholder}
      onChange={onChange}
      name={name}
      value={value}
      locale={i18n.language}
    />
  );
};

export default InlineDatePicker;
