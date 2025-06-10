/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { getLocalTimeZone, today } from "@internationalized/date";
import { ArrowLeftLine, ArrowLeftShortLine, ArrowRightShortLine } from "@ndla/icons";
import {
  Button,
  DatePickerContent as DatePickerContentPrimitive,
  DatePickerContext,
  DatePickerNextTrigger,
  DatePickerPrevTrigger,
  DatePickerRangeText,
  DatePickerTable,
  DatePickerTableBody,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerTableHead,
  DatePickerTableHeader,
  DatePickerTableRow,
  DatePickerView,
  DatePickerViewControl,
  DatePickerViewTrigger,
  IconButton,
} from "@ndla/primitives";

export const DatePickerContent = () => {
  const { t } = useTranslation();
  return (
    <DatePickerContentPrimitive>
      <DatePickerView view="day">
        <DatePickerContext>
          {(api) => (
            <>
              <DatePickerViewControl>
                <DatePickerPrevTrigger asChild>
                  <IconButton variant="tertiary" size="small">
                    <ArrowLeftShortLine />
                  </IconButton>
                </DatePickerPrevTrigger>
                <DatePickerViewTrigger asChild>
                  <Button variant="tertiary" size="small">
                    <DatePickerRangeText />
                  </Button>
                </DatePickerViewTrigger>
                <DatePickerNextTrigger asChild>
                  <IconButton variant="tertiary" size="small">
                    <ArrowRightShortLine />
                  </IconButton>
                </DatePickerNextTrigger>
                <Button
                  size="small"
                  onClick={() => {
                    api.selectToday();
                    api.setValue([today(getLocalTimeZone())]);
                  }}
                >
                  {t("datePicker.goToToday")}
                </Button>
              </DatePickerViewControl>
              <DatePickerTable>
                <DatePickerTableHead>
                  <DatePickerTableRow>
                    {api.weekDays.map((weekDay, id) => (
                      <DatePickerTableHeader key={id}>{weekDay.narrow}</DatePickerTableHeader>
                    ))}
                  </DatePickerTableRow>
                </DatePickerTableHead>
                <DatePickerTableBody>
                  {api.weeks.map((week, id) => (
                    <DatePickerTableRow key={id}>
                      {week.map((day, id) => {
                        return (
                          <DatePickerTableCell key={id} value={day}>
                            <DatePickerTableCellTrigger
                              asChild
                              data-state={api.value[0]?.compare(day) === 0 ? "on" : "off"}
                            >
                              <IconButton variant="tertiary">{day.day}</IconButton>
                            </DatePickerTableCellTrigger>
                          </DatePickerTableCell>
                        );
                      })}
                    </DatePickerTableRow>
                  ))}
                </DatePickerTableBody>
              </DatePickerTable>
            </>
          )}
        </DatePickerContext>
      </DatePickerView>
      <DatePickerView view="month">
        <DatePickerContext>
          {(api) => (
            <>
              <DatePickerViewControl>
                <DatePickerPrevTrigger asChild>
                  <IconButton variant="tertiary" size="small">
                    <ArrowLeftLine />
                  </IconButton>
                </DatePickerPrevTrigger>
                <DatePickerViewTrigger asChild>
                  <Button variant="tertiary" size="small">
                    <DatePickerRangeText />
                  </Button>
                </DatePickerViewTrigger>
                <DatePickerNextTrigger asChild>
                  <IconButton variant="tertiary" size="small">
                    <ArrowRightShortLine />
                  </IconButton>
                </DatePickerNextTrigger>
              </DatePickerViewControl>
              <DatePickerTable>
                <DatePickerTableBody>
                  {api.getMonthsGrid({ columns: 4, format: "short" }).map((months, id) => (
                    <DatePickerTableRow key={id}>
                      {months.map((month, id) => (
                        <DatePickerTableCell key={id} value={month.value}>
                          <DatePickerTableCellTrigger
                            asChild
                            data-state={api.value?.[0]?.month === month.value ? "on" : "off"}
                          >
                            <Button variant="tertiary">{month.label}</Button>
                          </DatePickerTableCellTrigger>
                        </DatePickerTableCell>
                      ))}
                    </DatePickerTableRow>
                  ))}
                </DatePickerTableBody>
              </DatePickerTable>
            </>
          )}
        </DatePickerContext>
      </DatePickerView>
      <DatePickerView view="year">
        <DatePickerContext>
          {(api) => (
            <>
              <DatePickerViewControl>
                <DatePickerPrevTrigger asChild>
                  <IconButton variant="tertiary" size="small">
                    <ArrowLeftShortLine />
                  </IconButton>
                </DatePickerPrevTrigger>
                <DatePickerViewTrigger asChild>
                  <Button variant="tertiary" size="small">
                    <DatePickerRangeText />
                  </Button>
                </DatePickerViewTrigger>
                <DatePickerNextTrigger asChild>
                  <IconButton variant="tertiary" size="small">
                    <ArrowRightShortLine />
                  </IconButton>
                </DatePickerNextTrigger>
              </DatePickerViewControl>
              <DatePickerTable>
                <DatePickerTableBody>
                  {api.getYearsGrid({ columns: 4 }).map((years, id) => (
                    <DatePickerTableRow key={id}>
                      {years.map((year, id) => (
                        <DatePickerTableCell key={id} value={year.value}>
                          <DatePickerTableCellTrigger
                            asChild
                            data-state={api.value?.[0]?.year === year.value ? "on" : "off"}
                          >
                            <Button variant="tertiary">{year.label}</Button>
                          </DatePickerTableCellTrigger>
                        </DatePickerTableCell>
                      ))}
                    </DatePickerTableRow>
                  ))}
                </DatePickerTableBody>
              </DatePickerTable>
            </>
          )}
        </DatePickerContext>
      </DatePickerView>
    </DatePickerContentPrimitive>
  );
};
