/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { format } from "date-fns";
import { useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors, misc, spacing } from "@ndla/core";
import { Calendar } from "@ndla/icons/editor";
import DatePicker from "../../../components/DatePicker";
import { formatDateForBackend } from "../../../util/formatDate";

export interface DateChangedEvent {
  target: {
    name: string;
    value: string;
    type: string;
  };
  currentTarget: {
    name: string;
    value: string;
    type: string;
  };
}

interface Props {
  name: string;
  onChange: (event: DateChangedEvent) => void;
  value?: string;
  placeholder?: string;
  title?: string;
}

const StyledButton = styled(ButtonV2)`
  width: 100%;
  height: 100%;
  justify-content: space-between;
  border-radius: ${misc.borderRadius};
  border: 1px solid ${colors.brand.greyLighter};
  color: ${colors.brand.greyMedium};
  padding-left: ${spacing.nsmall};
  padding-right: ${spacing.xsmall};
  svg {
    color: ${colors.brand.tertiary};
    width: 24px;
    height: 24px;
  }

  &[data-has-value="true"] {
    color: ${colors.text.primary};
  }

  &:hover,
  &:focus,
  &:focus-within,
  &:active,
  &:focus-visible {
    border: 1px solid ${colors.brand.greyLighter};
    padding-left: ${spacing.nsmall};
    padding-right: ${spacing.xsmall};
    color: ${colors.brand.greyMedium};
    &[data-has-value="true"] {
      color: ${colors.text.primary};
    }
  }
`;

const InlineDatePicker = ({ onChange, value, name, placeholder, title }: Props) => {
  const dateValue = useMemo(() => (value ? new Date(value) : undefined), [value]);
  const displayValue = useMemo(() => (dateValue ? format(dateValue, "dd/MM/yyyy") : undefined), [dateValue]);
  const onValueChange = useCallback(
    (value?: Date) => {
      if (!value) return;
      const target = {
        name,
        value: formatDateForBackend(value),
        type: "DateTime",
      };
      return onChange({
        target,
        currentTarget: target,
      });
    },
    [name, onChange],
  );

  return (
    <DatePicker onChange={onValueChange} value={dateValue}>
      <StyledButton variant="stripped" data-has-value={!!displayValue} title={title}>
        {displayValue ?? placeholder}
        <Calendar />
      </StyledButton>
    </DatePicker>
  );
};

export default InlineDatePicker;
