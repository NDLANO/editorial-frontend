const measurements = ['B', 'KB', 'MB', 'GB', 'TB'];

export const bytesToSensibleFormat = (numberValue: number, measurement?: string): string => {
  if (numberValue < 100) {
    return `${Math.round((numberValue + Number.EPSILON) * 100) / 100}${measurement ??
      measurements[0]}`;
  } else {
    const currentMeasurement = measurement ? measurements.indexOf(measurement) : 0;
    return bytesToSensibleFormat(numberValue / 1024, measurements[currentMeasurement + 1]);
  }
};
