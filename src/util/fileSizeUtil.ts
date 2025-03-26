/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const measurements = ["B", "KB", "MB", "GB", "TB"];

export const bytesToSensibleFormat = (numberValue: number, measurement?: string): string => {
  if (numberValue < 100) {
    return `${Math.round((numberValue + Number.EPSILON) * 100) / 100}${measurement ?? measurements[0]}`;
  } else {
    const currentMeasurement = measurement ? measurements.indexOf(measurement) : 0;
    return bytesToSensibleFormat(numberValue / 1024, measurements[currentMeasurement + 1]);
  }
};
