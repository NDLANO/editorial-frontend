/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DatePickerValueChangeDetails } from "@ark-ui/react";
import { getLocalTimeZone, parseAbsoluteToLocal, ZonedDateTime } from "@internationalized/date";
import { PencilFill } from "@ndla/icons";
import { Button, DatePickerControl, DatePickerRoot, DatePickerTrigger, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useDatePickerTranslations } from "@ndla/ui";
import formatDate from "../../util/formatDate";
import { DatePickerContent } from "../abstractions/DatePicker";

interface Creator {
  name: string;
  type: string;
}

type Creators = Creator[];

interface Props {
  creators: Creators;
  allowEdit?: boolean;
  published?: string;
  onChange: (date: string) => void;
  contentType?: "topicArticle" | "concept";
}

const StyledDiv = styled("div", {
  base: {
    display: "flex",
    flexWrap: "wrap",
    color: "text.subtle",
    alignItems: "center",
    gap: "5xsmall",
  },
});

const LastUpdatedLine = ({ creators, published, onChange, allowEdit = false, contentType = "topicArticle" }: Props) => {
  const { t } = useTranslation();
  const translations = useDatePickerTranslations();
  const dateLabel = t(`${contentType}Form.info.lastUpdated`);

  const dateValue = useMemo(() => {
    if (!published) return [];
    return (published ? [parseAbsoluteToLocal(published)] : []) as ZonedDateTime[];
  }, [published]);

  const onValueChange = useCallback(
    (details: DatePickerValueChangeDetails) => {
      const value = details.value[0];
      if (value) {
        const formattedDate = value.toDate(getLocalTimeZone());
        onChange(formattedDate.toISOString());
      }
    },
    [onChange],
  );

  return (
    <StyledDiv>
      <Text>
        {creators.map((creator) => creator.name).join(", ")}
        {!!published && ` - ${dateLabel}: `}
        {!!published && !allowEdit && formatDate(published)}
      </Text>
      {!!published && !!allowEdit && (
        <DatePickerRoot
          translations={translations}
          value={dateValue}
          onValueChange={onValueChange}
          locale="nb-NO"
          fixedWeeks
          startOfWeek={1}
          outsideDaySelectable
          lazyMount
          unmountOnExit
        >
          <DatePickerControl>
            <DatePickerTrigger asChild>
              <Button variant="tertiary" size="small" data-testid="last-edited">
                {formatDate(published)} <PencilFill />
              </Button>
            </DatePickerTrigger>
          </DatePickerControl>
          <DatePickerContent />
        </DatePickerRoot>
      )}
    </StyledDiv>
  );
};

export default memo(LastUpdatedLine);
