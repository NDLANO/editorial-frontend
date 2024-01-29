/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ButtonV2 } from "@ndla/button";
import { Pencil } from "@ndla/icons/action";
import formatDate, { formatDateForBackend } from "../../util/formatDate";
import DatePicker from "../DatePicker";

interface Props {
  published: string;
  onChange: (date: string) => void;
}

const DateEdit = ({ published, onChange }: Props) => (
  <DatePicker value={new Date(published)} onChange={(date) => (date ? onChange(formatDateForBackend(date)) : {})}>
    <ButtonV2 variant="link" data-testid="last-edited">
      {formatDate(published)} <Pencil />
    </ButtonV2>
  </DatePicker>
);

export default DateEdit;
