/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo } from "react";
import { DatePickerValueChangeDetails } from "@ark-ui/react";
import { getLocalTimeZone, parseAbsoluteToLocal } from "@internationalized/date";
import { CalendarLine } from "@ndla/icons";
import { Button, DatePickerControl, DatePickerRoot, DatePickerTrigger } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useDatePickerTranslations } from "@ndla/ui";
import { DatePickerContent } from "../../../components/abstractions/DatePicker";
import { formatDateForBackend } from "../../../util/formatDate";

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

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

const StyledDatePickerControl = styled(DatePickerControl, {
  base: {
    width: "100%",
  },
});

const StyledButton = styled(Button, {
  base: {
    width: "100%",
  },
});

interface Props {
  name: string;
  onChange: (event: DateChangedEvent) => void;
  value?: string;
  placeholder?: string;
  title?: string;
}

const InlineDatePicker = ({ onChange, value, name, placeholder, title }: Props) => {
  const translations = useDatePickerTranslations();
  const dateValue = useMemo(() => (value ? parseAbsoluteToLocal(value) : undefined), [value]);
  const displayValue = useMemo(() => (dateValue ? dateFormatter.format(dateValue.toDate()) : undefined), [dateValue]);
  const onValueChange = useCallback(
    (details: DatePickerValueChangeDetails) => {
      const value = details.value[0]?.toDate(getLocalTimeZone());
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
    <DatePickerRoot
      translations={translations}
      value={dateValue ? [dateValue] : undefined}
      onValueChange={onValueChange}
      locale="nb-NO"
      fixedWeeks
      startOfWeek={1}
      outsideDaySelectable
      lazyMount
      unmountOnExit
    >
      <StyledDatePickerControl>
        <DatePickerTrigger asChild>
          <StyledButton variant="secondary" title={title}>
            {displayValue ?? placeholder}
            <CalendarLine />
          </StyledButton>
        </DatePickerTrigger>
      </StyledDatePickerControl>
      <DatePickerContent />
    </DatePickerRoot>
  );
};

export default InlineDatePicker;
