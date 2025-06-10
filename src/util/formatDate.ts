/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { parseAbsoluteToLocal } from "@internationalized/date";

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export default function formatDate(date: string | number | undefined): string {
  if (!date) return "";

  if (typeof date === "string") {
    const parsedDate = parseAbsoluteToLocal(date);
    return dateFormatter.format(parsedDate.toDate());
  }

  return dateFormatter.format(date);
}

export function formatDateForBackend(date: Date): string {
  return date.toISOString().split(".").shift() + "Z";
}
