/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
  return addYoutubeTimeStamps(url, start, stop);
};

export const addYoutubeTimeStamps = (url: string, start?: string, stop?: string) => {
  const urlObj = new URL(url);
  const startSeconds = start ? calcSecondsFromHMS(start) : undefined;
  const stopSeconds = stop ? calcSecondsFromHMS(stop) : undefined;

  if (startSeconds) {
    urlObj.searchParams.set("start", startSeconds.toString());
  }
  if (stopSeconds) {
    urlObj.searchParams.set("end", stopSeconds.toString());
  }

  return urlObj.toString();
};

export const getStartTime = (url: string) => {
  const urlObj = new URL(url);
  return toHMS(Number(urlObj.searchParams.get("start")));
};

export const getStopTime = (url: string) => {
  const urlObj = new URL(url);
  return toHMS(Number(urlObj.searchParams.get("end")));
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

export const addBrightCoveTimeStampVideoid = (videoid: string, start: string) => {
  const [baseVideoid] = videoid.split("&t=");
  const startSeconds = start ? `${calcSecondsFromHMS(start)}s` : ``;

  return startSeconds === "" || startSeconds === "0s" ? baseVideoid : `${baseVideoid}&t=${startSeconds}`;
};

export const getBrightCoveStartTime = (videoid: string) => {
  const time = videoid.split("&t=")[1] || "";
  return time === "" ? "" : toHMS(parseInt(time));
};
