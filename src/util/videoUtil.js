/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import queryString from 'query-string';

export const toHMS = seconds => {
  if (!seconds) return undefined;

  const minute = Math.floor(seconds / 60) % 60;
  const hour = Math.floor(seconds / 3600) % 60;
  const second = seconds % 60;

  const hours = hour > 0 ? hour + ':' : '';
  const minutes = minute > 0 ? minute + ':' : '';
  const secondos = second < 10 && second > 0 ? '0' + second : second;

  return `${hours}${minutes}${secondos}`;
};

export const calcSecondsFromHMS = hms => {
  const hmsArray = hms
    .split(':')
    .reverse()
    .filter(Number);
  if (!hmsArray.length) return;
  return hmsArray
    .map(a => parseInt(a, 10))
    .reduce((acc, element, index) => acc + element * Math.pow(60, index));
};

export const getYoutubeEmbedUrl = (url, start, stop) => {
  const youtubeEmbedUrl = url.includes('embed')
    ? `${url.split('?')[0]}?`
    : `https://www.youtube.com/embed/${url.split('v=')[1]}?`;
  return addYoutubeTimeStamps(youtubeEmbedUrl, start, stop);
};

export const addYoutubeTimeStamps = (url, start, stop) => {
  const [baseUrl, query] = url.split('?');
  const params = queryString.parse(query);

  const startSeconds = start ? calcSecondsFromHMS(start) : params.start;
  const stopSeconds = stop ? calcSecondsFromHMS(stop) : params.stop;

  const updatedQuery = queryString.stringify({
    ...(startSeconds && { start: startSeconds }),
    ...(stopSeconds && { end: stopSeconds }),
  });

  return `${baseUrl}?${updatedQuery}`;
};

export const getStartTime = url => {
  const params = queryString.parse(url.split('?')[1]);
  return toHMS(params.start);
};

export const getStopTime = url => {
  const params = queryString.parse(url.split('?')[1]);
  return toHMS(params.end);
};

export const removeParams = url => {
  return url.split('?')[0];
};
