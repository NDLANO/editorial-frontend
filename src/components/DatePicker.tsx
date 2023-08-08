/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useMemo, useState } from 'react';
import {
  DayPicker,
  Dropdown,
  Labels,
  DropdownProps,
  CustomComponents,
  useNavigation,
} from 'react-day-picker';
import { nb, nn, enGB } from 'date-fns/locale';
import { TFunction, useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { Arrow, Content, Portal, Root, Trigger } from '@radix-ui/react-popover';
import { colors, misc } from '@ndla/core';
import { ButtonV2 } from '@ndla/button';

interface Props {
  children: ReactNode;
  value?: Date;
  onChange: (value?: Date) => void;
}

const StyledContent = styled(Content)`
  background-color: ${colors.white};
  z-index: 100;
  border: 1px solid ${colors.black};
  border-radius: ${misc.borderRadius};
`;

const getDatePickerTranslations = (t: TFunction): Partial<Labels> => {
  return {
    labelMonthDropdown: () => t('datePicker.chooseMonth'),
    labelYearDropdown: () => t('datePicker.chooseYear'),
    labelNext: () => t('datePicker.nextMonth'),
    labelPrevious: () => t('datePicker.previousMonth'),
  };
};

const StyledInput = styled.input`
  border-radius: ${misc.borderRadius};
  min-width: 80px;
  flex: 0;
`;

const MIN_YEAR = 1900;
const MAX_YEAR = 3000;

const DatePickerFooter = () => {
  const { t } = useTranslation();
  const { goToDate } = useNavigation();

  return (
    <ButtonV2 variant="outline" onClick={() => goToDate(new Date())}>
      {t('datePicker.goToToday')}
    </ButtonV2>
  );
};

const DatePickerDropdown = (props: DropdownProps) => {
  if (props.name === 'months') {
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
    if (i18n.language === 'en') {
      return enGB;
    } else if (i18n.language === 'nn') {
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
    <Root open={open} onOpenChange={setOpen}>
      <Trigger asChild>{children}</Trigger>
      <Portal>
        <StyledContent>
          <Arrow />
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
        </StyledContent>
      </Portal>
    </Root>
  );
};

export default DatePicker;
