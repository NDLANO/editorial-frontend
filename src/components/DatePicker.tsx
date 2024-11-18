/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { nb, nn, enGB } from "date-fns/locale";
import { TFunction } from "i18next";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { DayPicker, Dropdown, Labels, DropdownProps, CustomComponents, useNavigation } from "react-day-picker";
import { useTranslation } from "react-i18next";
import { Portal } from "@ark-ui/react";
import { Button, PopoverArrow, PopoverContent, PopoverRoot, PopoverTrigger } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

interface Props {
  children: ReactNode;
  value?: Date;
  onChange: (value?: Date) => void;
}

const getDatePickerTranslations = (t: TFunction): Partial<Labels> => {
  return {
    labelMonthDropdown: () => t("datePicker.chooseMonth"),
    labelYearDropdown: () => t("datePicker.chooseYear"),
    labelNext: () => t("datePicker.nextMonth"),
    labelPrevious: () => t("datePicker.previousMonth"),
  };
};

const StyledInput = styled("input", {
  base: {
    borderRadius: "xsmall",
    minWidth: "4xlarge",
    flex: "0",
  },
});

const MIN_YEAR = 1900;
const MAX_YEAR = 3000;

const DatePickerFooter = () => {
  const { t } = useTranslation();
  const { goToDate } = useNavigation();

  return (
    <Button variant="secondary" onClick={() => goToDate(new Date())}>
      {t("datePicker.goToToday")}
    </Button>
  );
};

const DatePickerDropdown = (props: DropdownProps) => {
  if (props.name === "months") {
    return <Dropdown {...props} />;
  }
  const { children, ...rest } = props;
  //@ts-ignore
  return <StyledInput type="number" min={MIN_YEAR} max={MAX_YEAR} {...rest} />;
};

const DatePicker = ({ children, value, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const translations = useMemo(() => getDatePickerTranslations(t), [t]);

  const components: CustomComponents = useMemo(() => ({ Dropdown: DatePickerDropdown }), []);

  const locale = useMemo(() => {
    if (i18n.language === "en") {
      return enGB;
    } else if (i18n.language === "nn") {
      return nn;
    } else return nb;
  }, [i18n.language]);

  const onSelect = useCallback(
    (date?: Date) => {
      setOpen(false);
      onChange(date);
    },
    [onChange],
  );

  return (
    <PopoverRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <DayPicker
            components={components}
            mode="single"
            captionLayout="dropdown-buttons"
            locale={locale}
            selected={value}
            onSelect={onSelect}
            showOutsideDays
            fixedWeeks
            defaultMonth={value}
            fromYear={MIN_YEAR}
            toYear={MAX_YEAR}
            labels={translations}
            footer={<DatePickerFooter />}
          />
        </PopoverContent>
      </Portal>
    </PopoverRoot>
  );
};

export default DatePicker;
