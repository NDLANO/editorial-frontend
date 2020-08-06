/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const toHMS = seconds => {
  if (!seconds) return undefined;

  const minute = Math.floor(seconds / 60) % 60;
  const hour = Math.floor(minute / 60) % 60;
  const second = seconds % 60;

  const hours = hour > 0 ? hour + ':' : '';
  const minutes = minute > 0 ? minute + ':' : '';
  const secondos = second < 10 && second > 0 ? '0' + second : second;

  return `${hours}${minutes}${secondos}`;
};

export const calcSecondsFromHMS = hms => {
  return hms
    .split(':')
    .reverse()
    .map(a => parseInt(a, 10))
    .filter(Number)
    .reduce((acc, element, index) => acc + element * Math.pow(60, index));
};

export const getYoutubeEmbedUrl = (url, start, stop) => {
  const youtubeEmbedUrl = url.includes('embed')
    ? `${url.split('?')[0]}?`
    : `https://www.youtube.com/embed/${url.split('v=')[1]}?`;
  return addYoutubeTimeStamps(youtubeEmbedUrl, start, stop);
};

export const addYoutubeTimeStamps = (url, start, stop) => {
  if (start) url += `&start=${calcSecondsFromHMS(start)}`;
  if (stop) url += `&end=${calcSecondsFromHMS(stop)}`;
  return url;
}