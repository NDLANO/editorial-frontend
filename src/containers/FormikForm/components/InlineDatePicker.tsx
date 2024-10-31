/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { format } from "date-fns";
import { useCallback, useMemo } from "react";
import { Calendar } from "@ndla/icons/editor";
import { Button } from "@ndla/primitives";
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
      <Button variant="secondary" title={title}>
        {displayValue ?? placeholder}
        <Calendar />
      </Button>
    </DatePicker>
  );
};

export default InlineDatePicker;
