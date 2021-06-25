/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import queryString from 'query-string';

export const toHMS = (seconds: number) => {
  const minute = Math.floor(seconds / 60) % 60;
  const hour = Math.floor(seconds / 3600) % 60;
  const second = seconds % 60;

  const hours = hour > 0 ? hour + ':' : '';
  const minutes = minute > 0 ? minute + ':' : '';
  const secondos = second < 10 && second > 0 ? '0' + second : second;

  const hms = `${hours}${minutes}${secondos}`;

  return hms === 'NaN' || hms === '0' ? '' : hms;
};

export const calcSecondsFromHMS = (hms: string) => {
  return hms
    .split(':')
    .reverse()
    .filter(Number)
    .map(numberString => parseInt(numberString, 10))
    .reduce((accumulator, number, index) => accumulator + number * Math.pow(60, index), 0);
};

export const getYoutubeEmbedUrl = (url: string, start?: string, stop?: string) => {
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${(url.split('/').pop() || '')
    .split('v=')
    .pop()}?`;
  return addYoutubeTimeStamps(youtubeEmbedUrl, start, stop);
};

export const addYoutubeTimeStamps = (url: string, start?: string, stop?: string) => {
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

export const getStartTime = (url: string) => {
  const params = queryString.parse(url.split('?')[1]);
  return toHMS(params.start);
};

export const getStopTime = (url: string) => {
  const params = queryString.parse(url.split('?')[1]);
  return toHMS(params.end);
};

export const removeParams = (url: string) => {
  return url.split('?')[0];
};

export const addBrightCoveTimeStampVideoid = (videoid: string, start: string) => {
  const [baseVideoid, seconds] = videoid.split('&t=');
  const startSeconds = start ? `${calcSecondsFromHMS(start)}s` : `${seconds}`;

  return `${baseVideoid}&t=${startSeconds}`;
};

export const addBrightCovetimeStampSrc = (src: string, start: string) => {
  const [baseUrl, query] = src.split('?');
  const params = queryString.parse(query);

  const startSeconds = start ? calcSecondsFromHMS(start) : params.t;

  const updatedQuery = queryString.stringify({
    ...(startSeconds && { start: startSeconds }),
  });

  return `${baseUrl}?${updatedQuery}`;
};

export const getBrightCoveStartTime = (videoid: string) => {
  const time = videoid.split('&t=')[1] || '';
  return toHMS(parseInt(time));
};
