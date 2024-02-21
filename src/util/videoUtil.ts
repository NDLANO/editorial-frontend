/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import queryString from "query-string";

export const toHMS = (time: number) => {
  const seconds = time < 0 ? time * -1 : time;
  const minute = Math.floor(seconds / 60) % 60;
  const hour = Math.floor(seconds / 3600) % 60;
  const second = seconds % 60;

  const hours = hour > 0 ? `${hour < 10 ? "0" + hour : hour}:` : "00:";
  const minutes = minute > 0 ? `${minute < 10 ? "0" + minute : minute}:` : "00:";
  const secondos = second < 10 && second >= 0 ? "0" + second : second;
  const hms = `${hours}${minutes}${secondos}`;

  return hms === "0" || hms.includes("NaN") ? "" : hms;
};

export const calcSecondsFromHMS = (hms: string) => {
  return hms
    .split(":")
    .reverse()
    .map((numberString) => parseInt(numberString, 10))
    .filter((value) => !Number.isNaN(value))
    .reduce((accumulator, number, index) => accumulator + number * Math.pow(60, index), 0);
};

export const getYoutubeEmbedUrl = (url: string, start?: string, stop?: string) => {
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${(url.split("/").pop() || "").split("v=").pop()}?`;
  return addYoutubeTimeStamps(youtubeEmbedUrl, start, stop);
};

export const addYoutubeTimeStamps = (url: string, start?: string, stop?: string) => {
  const [baseUrl] = url.split("?");

  const startSeconds = start ? calcSecondsFromHMS(start) : undefined;
  const stopSeconds = stop ? calcSecondsFromHMS(stop) : undefined;

  const updatedQuery = queryString.stringify({
    ...(startSeconds && { start: startSeconds }),
    ...(stopSeconds && { end: stopSeconds }),
  });
  return `${baseUrl}?${updatedQuery}`;
};

export const getStartTime = (url: string) => {
  const params = queryString.parse(url.split("?")[1]);
  return toHMS(params.start);
};

export const getStopTime = (url: string) => {
  const params = queryString.parse(url.split("?")[1]);
  return toHMS(params.end);
};

export const removeYoutubeTimeStamps = (url: string) => {
  const [baseUrl, params] = url.split("?");
  const newParams = new URLSearchParams(params);
  newParams.delete("start");
  newParams.delete("end");
  if (newParams.size) {
    return `${baseUrl}?${newParams.toString()}`;
  }
  return baseUrl;
};

export const removeParams = (url: string) => {
  return url.split("?")[0];
};

export const addBrightCoveTimeStampVideoid = (videoid: string, start: string) => {
  const [baseVideoid] = videoid.split("&t=");
  const startSeconds = start ? `${calcSecondsFromHMS(start)}s` : ``;

  return `${baseVideoid}&t=${startSeconds}`;
};

export const addBrightCovetimeStampSrc = (src: string, start: string) => {
  const [baseUrl, videoid] = src.split("?");
  const newVideoid = start ? addBrightCoveTimeStampVideoid(videoid, start) : videoid.split("&t=")[0];

  return `${baseUrl}?${newVideoid}`;
};

export const getBrightCoveStartTime = (videoid: string) => {
  const time = videoid.split("&t=")[1] || "";
  return time === "" ? "" : toHMS(parseInt(time));
};
