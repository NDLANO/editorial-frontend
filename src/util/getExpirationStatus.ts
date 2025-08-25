/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const getExpirationStatus = (date?: string): "warn" | "expired" | undefined => {
  if (!date) return undefined;
  const parsedDate = new Date(date);

  const daysToWarn = 365;
  const errorDate = new Date();
  const warnDate = new Date();
  warnDate.setDate(errorDate.getDate() + daysToWarn);

  if (errorDate > parsedDate) return "expired";
  if (warnDate > parsedDate) return "warn";
};
